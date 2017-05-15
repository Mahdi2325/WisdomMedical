namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    
    public partial class ServiceItemService : BaseService , IServiceItemService
    {
        #region DC_ServiceItem
        public BaseResponse<IList<ServiceItemModel>> QueryServiceItem(BaseRequest<ServiceItemFilter> request)
        {
            var response = new BaseResponse<IList<ServiceItemModel>>();

            var q = from si in unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(a=>!a.IsDeleted)
                    join sic in unitOfWork.GetRepository<DC_ServiceItemCategory>().dbSet on si.ServiceItemCategoryID equals sic.ServiceItemCategoryID
                    where si.IsDeleted == false
                    select new
                    {
                        si = si,
                        SIType = sic.SICName
                    };

            if (request != null)
            {
                if (request.Data.ServiceItemID.HasValue)
                {
                    q = q.Where(m => m.si.ServiceItemID == request.Data.ServiceItemID);
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.si.OrganizationID == request.Data.OrganizationID);
                }
                if (request.Data.ServiceItemCategoryID.HasValue)
                {
                    q = q.Where(m => m.si.ServiceItemCategoryID == request.Data.ServiceItemCategoryID);
                }
                if (!string.IsNullOrEmpty(request.Data.KeyWords))
                {
                    q = q.Where(m => m.si.SINo.Contains(request.Data.KeyWords) || m.si.SIName.Contains(request.Data.KeyWords));
                }
                if (request.Data.ServiceItemIds != null) {
                    q = q.Where(m => request.Data.ServiceItemIds.Contains(m.si.ServiceItemID));
                }
            }
            q = q.OrderBy(m => m.si.OrderNum).ThenByDescending(a => a.si.ServiceItemID);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<ServiceItemModel>();
                foreach (dynamic item in list)
                {
                    var serviceItem = Mapper.DynamicMap<ServiceItemModel>(item.si);
                    serviceItem.SIType = item.SIType;
                    newList.Add(serviceItem);
                }
                response.Data = newList;
            };
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = q.ToList();
                mapperResponse(list);
            }
            return response;
        }

        public BaseResponse<IList<ServiceItemModel>> QueryServiceItemWithServicePlan(BaseRequest<ServiceItemFilter> request)
        {
            var response = new BaseResponse<IList<ServiceItemModel>>();
            var nowDate = DateTime.Now;
            var servicePlanRepository = from a in unitOfWork.GetRepository<DC_ResidentServicePlan>().dbSet.Where(a => a.ResidentID == request.Data.ResidentID && a.SStartDate <= nowDate && a.SEndDate >= nowDate)
                    join b in unitOfWork.GetRepository<DC_ResidentServicePlanItem>().dbSet.Where(a=>a.RestTimes>0) on a.ResidentServicePlanID equals b.ResidentServicePlanID
                    group b by b.ServiceItemID into g
                    select new {
                        ServiceItemID = g.Key,
                        ServiceTimes = g.Sum(a=>a.ServiceTimes),
                        RestTimes = g.Sum(a=>a.RestTimes),
                        ResidentServicePlanItemID = g.Select(a=>a.ResidentServicePlanItemID).FirstOrDefault()
                    };

            var q =( from si in unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(a=>!a.IsDeleted)
                    join sic in unitOfWork.GetRepository<DC_ServiceItemCategory>().dbSet on si.ServiceItemCategoryID equals sic.ServiceItemCategoryID
                    join m in servicePlanRepository on si.ServiceItemID equals m.ServiceItemID
                    select new
                    {
                        si = si,
                        SIType = sic.SICName,
                        ServiceTimes = m.ServiceTimes,
                        RestTimes = m.RestTimes,
                        ResidentServicePlanItemID = m.ResidentServicePlanItemID
                    }).Union(
                    
                        from si in unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(a=>!a.IsDeleted)
                        join sic in unitOfWork.GetRepository<DC_ServiceItemCategory>().dbSet on si.ServiceItemCategoryID equals sic.ServiceItemCategoryID
                        select new
                        {
                            si = si,
                            SIType = sic.SICName,
                            ServiceTimes =new Nullable<int>(),
                            RestTimes = new Nullable<int>(),
                            ResidentServicePlanItemID = 0
                        }
                    );


            if (request != null)
            {
                if (request.Data.ServiceItemID.HasValue)
                {
                    q = q.Where(m => m.si.ServiceItemID == request.Data.ServiceItemID);
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.si.OrganizationID == request.Data.OrganizationID);
                }
                if (!string.IsNullOrEmpty(request.Data.SIBelong))
                {
                    q = q.Where(m => m.si.SIBelong == request.Data.SIBelong);
                }
                if (request.Data.ServiceItemCategoryID.HasValue)
                {
                    q = q.Where(m => m.si.ServiceItemCategoryID == request.Data.ServiceItemCategoryID);
                }
                if (!string.IsNullOrEmpty(request.Data.KeyWords))
                {
                    q = q.Where(m => m.si.SINo.Contains(request.Data.KeyWords) || m.si.SIName.Contains(request.Data.KeyWords));
                }
                if (request.Data.ServiceItemIds != null)
                {
                    q = q.Where(m => request.Data.ServiceItemIds.Contains(m.si.ServiceItemID));
                }
                if (request.Data.SelectedItemIDs != null && request.Data.SelectedItemIDs.Length>0)
                {
                    q = q.Where(m => !request.Data.SelectedItemIDs.Contains(m.si.ServiceItemID));
                }
            }
            q = q.OrderByDescending(m => new { m.RestTimes, m.si.CreatedTime});
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<ServiceItemModel>();
                foreach (dynamic item in list)
                {
                    var serviceItem = Mapper.DynamicMap<ServiceItemModel>(item.si);
                    serviceItem.SIType = item.SIType;
                    serviceItem.ServiceTimes = item.ServiceTimes;
                    serviceItem.RestTimes = item.RestTimes;
                    serviceItem.ResidentServicePlanItemID = item.ResidentServicePlanItemID;
                    newList.Add(serviceItem);
                }
                response.Data = newList;
            };
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = q.ToList();
                mapperResponse(list);
            }
            return response;
        }

        public BaseResponse<IList<ServiceItemCategoryModel>> QueryServiceCategoryAndItem(int OrganizationID)
        {
            var response = new BaseResponse<IList<ServiceItemCategoryModel>>();
            var itemRepository = base.unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(a => !a.IsDeleted && a.OrganizationID == OrganizationID);
            var catogory = from ct in unitOfWork.GetRepository<DC_ServiceItemCategory>().dbSet.Where(f => f.OrganizationID == OrganizationID && !f.IsDeleted)
                           select new ServiceItemCategoryModel
                           {
                               ServiceItemCategoryID = ct.ServiceItemCategoryID,
                               OrganizationID = ct.OrganizationID,
                               SICNo = ct.SICNo,
                               SICName = ct.SICName,
                               Remark = ct.Remark 
                           };

            var list = catogory.ToList();
            foreach (var item in list)
            {
                item.ServiceItems = Mapper.DynamicMap<IList<ServiceItemModel>> (itemRepository.Where(w => w.ServiceItemCategoryID == item.ServiceItemCategoryID).ToList());
            }
            response.Data = list;
            return response;
        }

        public BaseResponse<ServiceItemModel> GetServiceItem(int serviceItemID)
        {
            BaseResponse<ServiceItemModel> response = new BaseResponse<ServiceItemModel>();
            var request = new BaseRequest<ServiceItemFilter>()
            {
                Data = { ServiceItemID = serviceItemID }
            };
            var serviceItemList = QueryServiceItem(request);
            if (serviceItemList.RecordsCount > 0)
            {
                response.Data = serviceItemList.Data[0];

                var chargeItems = unitOfWork.GetRepository<DC_ChargeItem>()
                    .dbSet.Where(it => it.ServiceItemID == response.Data.ServiceItemID)
                    .ToList();
                response.Data.ChargeItems = Mapper.DynamicMap<List<ChargeItemModel>>(chargeItems);
            }
            return response;
        }

        public BaseResponse<ServiceItemModel> SaveServiceItem(ServiceItemModel request)
        {
            var response = new BaseResponse<ServiceItemModel>();
            Action<DC_ServiceItem> SaveChildren = (parent) => {
                if (request.ChargeItems != null)
                {
                    var chargeItemIds = request.ChargeItems.Select(it => it.ChargeItemID).ToList();
                    var oldChargeItemIdsItemIds = parent.DC_ChargeItem.Select(it => it.ChargeItemID).ToList();
                    var chargeItemList = unitOfWork.GetRepository<DC_ChargeItem>().dbSet.Where(it => chargeItemIds.Contains(it.ChargeItemID)).ToList();
                    var oldChargeItemList = parent.DC_ChargeItem.ToList(); 

                    //更新存在的
                    oldChargeItemIdsItemIds.Intersect(chargeItemIds).ToList().ForEach(it =>
                    {
                        var oldItem = oldChargeItemList.Where(a => a.ChargeItemID == it).FirstOrDefault();
                        var newItem = request.ChargeItems.Where(a => a.ChargeItemID == it).FirstOrDefault();
                        if (oldItem != null && newItem != null)
                        {
                            oldItem.CIName = newItem.CIName;
                            oldItem.Unit = newItem.Unit;
                            oldItem.Price = newItem.Price.Value;
                            oldItem.Quantity = newItem.Quantity;
                        }
                    });

                    // 删除不存在的
                    oldChargeItemList.Except(chargeItemList).ToList().ForEach(it => 
                    { 
                        unitOfWork.GetRepository<DC_ChargeItem>().Delete(it);
                    });

                    // 添加不存在的
                    request.ChargeItems.Where(a => a.ChargeItemID == 0).ToList().ForEach(it => parent.DC_ChargeItem.Add(Mapper.DynamicMap<DC_ChargeItem>(it)));
                }
            };
            if (request.ServiceItemID==0)
            {
                var model = Mapper.DynamicMap<DC_ServiceItem>(request);
                SaveChildren(model);
                unitOfWork.GetRepository<DC_ServiceItem>().Insert(model);
            }
            else
            {
                var model = unitOfWork.GetRepository<DC_ServiceItem>().dbSet.FirstOrDefault(a => a.ServiceItemID == request.ServiceItemID);
                SaveChildren(model);
                Mapper.DynamicMap(request, model);
                unitOfWork.GetRepository<DC_ServiceItem>().Update(model);
            }
            unitOfWork.Save();
            response.Data = request;
            return response;
        }

        public BaseResponse DeleteServiceItem(int serviceItemID)
        {
            var item = unitOfWork.GetRepository<DC_ServiceItem>().dbSet.FirstOrDefault(a => a.ServiceItemID == serviceItemID);
            if (item!=null)
            {
                item.IsDeleted = true;
                unitOfWork.GetRepository<DC_ServiceItem>().Update(item);
                unitOfWork.Save();
            }
            return new BaseResponse() ;
        }

        public BaseResponse<IList<ServiceItemModel>> QueryHotServiceItem(int organizationID,int fetchCnt)
        {
            var response = new BaseResponse<IList<ServiceItemModel>>();

            var q = from a in unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(m => m.OrganizationID == organizationID && !m.IsDeleted)
                                        select new
                                        {
                                            ServiceItemID = a.ServiceItemID,
                                            OrganizationID = a.OrganizationID,
                                            SIName = a.SIName,
                                            PhotoPath = a.PhotoPath,
                                            Keywords = a.Keywords,
                                            Hot = a.Hot,
                                            OrderNum = a.OrderNum
                                        };

            q = q.OrderByDescending(a => a.Hot).ThenBy(m => m.OrderNum).ThenByDescending(a => a.ServiceItemID);
            var list = q.Take(fetchCnt).ToList();
            response.Data = Mapper.DynamicMap<IList<ServiceItemModel>>(list);
            return response;
        }
        #endregion
    }
}
