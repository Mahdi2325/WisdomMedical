namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public partial class ServiceGroupService : BaseService, IServiceGroupService
    {
        #region DC_ServiceGroup
        public BaseResponse<IList<ServiceGroupModel>> QueryServiceGroup(BaseRequest<ServiceGroupFilter> request)
        {
            var response = new BaseResponse<IList<ServiceGroupModel>>();
            var q = from a in unitOfWork.GetRepository<DC_ServiceGroup>().dbSet
                    select a;

            if (request != null)
            {
                if (request.Data.ServiceGroupID.HasValue)
                {
                    q = q.Where(m => m.ServiceGroupID == request.Data.ServiceGroupID);
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }
                if (!string.IsNullOrEmpty(request.Data.KeyWords))
                {
                    q = q.Where(m => m.SGNo.Contains(request.Data.KeyWords) || m.SGName.Contains(request.Data.KeyWords));
                }
                if (!string.IsNullOrEmpty(request.Data.Status))
                {
                    q = q.Where(m => m.Status == request.Data.Status);
                }
            }
            q = q.OrderBy(a=>a.OrderNum).ThenByDescending(m => m.ServiceGroupID);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<ServiceGroupModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<ServiceGroupModel>>(list);
            }
            return response;
        }

        public BaseResponse<ServiceGroupModel> GetServiceGroup(int serviceGroupID)
        {
            BaseResponse<ServiceGroupModel> response = new BaseResponse<ServiceGroupModel>();
            var findItem = unitOfWork.GetRepository<DC_ServiceGroup>().dbSet.FirstOrDefault((q) => q.ServiceGroupID == serviceGroupID);
            if (findItem != null)
            {
                var serviceItemIds = findItem.DC_SerGrpSerIt.Select(it => it.ServiceItemID.Value).ToList();
                response.Data = Mapper.DynamicMap<ServiceGroupModel>(findItem);
                // 取出带总价
                IServiceItemService service = IOCContainer.Instance.Resolve<IServiceItemService>();
                var request = new BaseRequest<ServiceItemFilter>();
                request.Data.ServiceItemIds = serviceItemIds;
                var serviceItemResponse = service.QueryServiceItem(request);
                //response.Data.GroupItems = (List<ServiceItemModel>)serviceItemResponse.Data;
                // 取出数量
                var serviceItems = unitOfWork.GetRepository<DC_SerGrpSerIt>()
                    .dbSet.Where(it => it.ServiceGroupID == response.Data.ServiceGroupID)
                    .Select(it => new { it.ServiceTimes, it.ServiceItemID })
                    .ToList();

                response.Data.GroupItems = new List<ServiceItemModel>();
                serviceItems.ForEach(it =>
                {
                    var subFindItem = serviceItemResponse.Data.FirstOrDefault(sub => sub.ServiceItemID == it.ServiceItemID);
                    if (subFindItem != null)
                    {
                        var newItem = Mapper.DynamicMap<ServiceItemModel>(subFindItem);
                        newItem.ServiceTimes = it.ServiceTimes;
                        response.Data.GroupItems.Add(newItem);
                    }
                });
            }
            return response;
        }

        public BaseResponse<ServiceGroupModel> SaveServiceGroup(ServiceGroupModel request)
        {
            var response = new BaseResponse<ServiceGroupModel>();
            Action<DC_ServiceGroup> SaveChildren = (parent) =>
            {
                if (request.GroupItems != null)
                {
                    parent.DC_SerGrpSerIt.Clear();
                    request.GroupItems.ForEach(item =>
                    {
                        var serGrpSerIt = new DC_SerGrpSerIt();
                        serGrpSerIt.ServiceItemID = item.ServiceItemID;
                        serGrpSerIt.ServiceTimes = item.ServiceTimes.Value;
                        parent.DC_SerGrpSerIt.Add(serGrpSerIt);
                    });
                }
            };
            var model = unitOfWork.GetRepository<DC_ServiceGroup>().dbSet.FirstOrDefault((q) => q.ServiceGroupID == request.ServiceGroupID);
            if (model == null)
            {
                model = Mapper.DynamicMap<DC_ServiceGroup>(request);
                SaveChildren(model);
                unitOfWork.GetRepository<DC_ServiceGroup>().Insert(model);
            }
            else
            {
                Mapper.DynamicMap(request, model);
                SaveChildren(model);
                unitOfWork.GetRepository<DC_ServiceGroup>().Update(model);
            }
            unitOfWork.Save();
            Mapper.DynamicMap(model, request);
            response.Data = request;
            return response;
        }

        public BaseResponse DeleteServiceGroup(int serviceGroupID)
        {
            return base.Delete<DC_ServiceGroup>(serviceGroupID);
        }

        public BaseResponse<IList<ServiceGroupModel>> QueryHotServiceGroup(int organizationID,int fetchCnt)
        {
            var response = new BaseResponse<IList<ServiceGroupModel>>();

            var q = from a in unitOfWork.GetRepository<DC_ServiceGroup>().dbSet.Where(m => m.OrganizationID == organizationID && m.Status=="启用" && !m.IsDeleted)
                    select new
                    {
                        ServiceGroupID = a.ServiceGroupID,
                        OrganizationID = a.OrganizationID,
                        SGName = a.SGName,
                        Photo = a.Photo,
                        Remark = a.Remark,
                        SumPrice = a.SumPrice,
                        Hot = a.Hot
                    };

            q = q.OrderByDescending(a => a.Hot).ThenByDescending(a => a.ServiceGroupID);
            var list = q.Take(fetchCnt).ToList();
            response.Data = Mapper.DynamicMap<IList<ServiceGroupModel>>(list);
            return response;
        }
        #endregion
    }
}
