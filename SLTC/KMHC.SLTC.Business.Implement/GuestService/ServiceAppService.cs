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

    public partial class ServiceAppService : BaseService, IServiceAppService
    {
        #region ORG_Dept
        public BaseResponse<IList<ServiceAppointmentModel>> QueryServiceApp(BaseRequest<ServiceAppFilter> request)
        {
            var response = new BaseResponse<IList<ServiceAppointmentModel>>();

            var q = from a in unitOfWork.GetRepository<DC_ServiceAppointment>().dbSet.Where(m=>!m.IsDeleted.Value)
                    join b in unitOfWork.GetRepository<DC_Resident>().dbSet on a.ResidentID equals b.ResidentID
                    join c in unitOfWork.GetRepository<DC_Person>().dbSet on b.PersonID equals c.PersonID
                    join x in unitOfWork.GetRepository<DC_PNC>().dbSet on a.PNCID equals x.PNCID into evluation
                    from y in evluation.DefaultIfEmpty()
                    select new
                    {
                        a,
                        b.OrganizationID,
                        PersonName = c.Name,
                        y.PNCName,
                        y.StartTime,
                        y.EndTime
                    };

            if (request != null)
            {
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }

                if (request.Data.ServiceAppID.HasValue)
                {
                    q = q.Where(m => m.a.ServiceAppID == request.Data.ServiceAppID);
                }
                if (request.Data.ResidentID.HasValue)
                {
                    q = q.Where(m => m.a.ResidentID == request.Data.ResidentID);
                }

                if (request.Data.ServiceDate.HasValue)
                {
                    q = q.Where(m => m.a.ServiceDate == request.Data.ServiceDate);
                }
                if (!string.IsNullOrEmpty(request.Data.Status))
                {
                    q = q.Where(m => m.a.Status==request.Data.Status);
                }
            }

            q = q.OrderByDescending(m => m.a.AppTime);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<ServiceAppointmentModel>();
                foreach (dynamic item in list)
                {
                    var serviceAppID = (int)item.a.ServiceAppID;
                    var serviceApp = Mapper.DynamicMap<ServiceAppointmentModel>(item.a);
                    serviceApp.PersonName = item.PersonName;
                    serviceApp.PNC = item.PNCName + "(" + item.StartTime + "-" + item.EndTime + ")";
                    serviceApp.ServiceItems = Mapper.DynamicMap<List<SerAppSerItModel>>(unitOfWork.GetRepository<DC_SerAppSerIt>().dbSet.Where(m => m.ServiceAppID == serviceAppID).ToList());
                    newList.Add(serviceApp);
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

        public BaseResponse<ServiceAppointmentModel> GetServiceApp(int serviceAppID)
        {
            BaseResponse<ServiceAppointmentModel> response = new BaseResponse<ServiceAppointmentModel>();
            var request = new BaseRequest<ServiceAppFilter>()
            {
                Data = { ServiceAppID = serviceAppID }
            };
            var serviceAppList = QueryServiceApp(request);
            if (serviceAppList.RecordsCount > 0)
            {
                response.Data = serviceAppList.Data[0];
            }
            return response;
        }

        public BaseResponse SaveServiceApp(ServiceAppointmentModel request)
        {
            unitOfWork.BeginTransaction();
            Action<DC_ServiceAppointment> SaveChildren = (parent) =>
            {
                if (request.ServiceItems != null)
                {
                    var chargeItemIds = request.ServiceItems.Select(it => it.ServiceAppSIID).ToList();
                    var oldChargeItemIdsItemIds = parent.DC_SerAppSerIt.Select(it => it.ServiceAppSIID).ToList();
                    var chargeItemList = unitOfWork.GetRepository<DC_SerAppSerIt>().dbSet.Where(it => chargeItemIds.Contains(it.ServiceAppSIID)).ToList();
                    var oldChargeItemList = parent.DC_SerAppSerIt.ToList();

                    //更新存在的
                    oldChargeItemIdsItemIds.Intersect(chargeItemIds).ToList().ForEach(it =>
                    {
                        var oldItem = oldChargeItemList.Where(a => a.ServiceAppSIID == it).FirstOrDefault();
                        var newItem = request.ServiceItems.Where(a => a.ServiceAppSIID == it).FirstOrDefault();
                        if (oldItem != null && newItem != null)
                        {
                            oldItem.Qty = newItem.Qty;
                        }
                    });

                    // 删除不存在的
                    oldChargeItemList.Except(chargeItemList).ToList().ForEach(it =>
                    {
                        unitOfWork.GetRepository<DC_SerAppSerIt>().Delete(it);
                    });

                    // 添加不存在的
                    request.ServiceItems.Where(a => a.ServiceAppSIID == 0).ToList().ForEach(it => parent.DC_SerAppSerIt.Add(Mapper.DynamicMap<DC_SerAppSerIt>(it)));
                }
            };
            if (request.ServiceAppID == 0)
            {
                var model = Mapper.DynamicMap<DC_ServiceAppointment>(request);
                model.DC_SerAppSerIt = Mapper.DynamicMap<List<DC_SerAppSerIt>>(request.ServiceItems);
                model.CreatedTime = DateTime.Now;
                unitOfWork.GetRepository<DC_ServiceAppointment>().Insert(model);
            }
            else
            {
                var model = unitOfWork.GetRepository<DC_ServiceAppointment>().dbSet.FirstOrDefault((q) => q.ServiceAppID == request.ServiceAppID);
                SaveChildren(model);
                Mapper.DynamicMap(request, model);
                unitOfWork.GetRepository<DC_ServiceAppointment>().Update(model);
            }
            unitOfWork.Commit();
            return new BaseResponse();
        }

        public BaseResponse DeleteServiceAppointment(int serviceAppID)
        {
            return base.Delete<DC_ServiceAppointment>(serviceAppID);
        }

        public BaseResponse CancelApp(int serviceAppID)
        {
            var serviceApp = unitOfWork.GetRepository<DC_ServiceAppointment>().Get(serviceAppID);
            if (serviceApp!=null)
            {
                serviceApp.Status = Enum.GetName(typeof(AppointmentStatus), AppointmentStatus.Canceled);
                unitOfWork.GetRepository<DC_ServiceAppointment>().Update(serviceApp);
                unitOfWork.Save();
            }
            return new BaseResponse();
        }

        public BaseResponse<List<PNCModel>> GetPNCList(DateTime date)
        {
            var queryFromDate = date.Date;
            var queryToDate = date.Date.AddDays(1);
            var cancelStatus = Enum.GetName(typeof(AppointmentStatus), AppointmentStatus.Canceled);
            var serviceAppRepository = from a in unitOfWork.GetRepository<DC_ServiceAppointment>().dbSet.Where(a => a.ServiceDate >= queryFromDate && a.ServiceDate < queryToDate && !a.IsDeleted.Value && a.Status != cancelStatus)
                        group a by a.PNCID into g
                        select new
                        {
                            PNCID =g.Key,
                            AppCount = g.Count() 
                        };

            var pnc = from a in unitOfWork.GetRepository<DC_PNC>().dbSet
                             join m in serviceAppRepository on a.PNCID equals m.PNCID into appCnt
                             from n in appCnt.DefaultIfEmpty()
                             select new PNCModel
                             { 
                                 PNCID = a.PNCID,
                                 PNCNo = a.PNCNo,
                                 PNCName = a.PNCName,
                                 StartTime = a.StartTime,
                                 EndTime = a.EndTime,
                                 AppCount = n.AppCount
                             };

            var response = new BaseResponse<List<PNCModel>>();
            response.Data = pnc.ToList();
            return response;
        }
        #endregion
    }
}
