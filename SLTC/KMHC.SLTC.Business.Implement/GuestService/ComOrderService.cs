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

    public partial class ComOrderService : BaseService , IComOrderService
    {
        #region ORG_Dept
        public BaseResponse<IList<ServiceOrderModel>> QueryComOrder(BaseRequest<ServiceOrderFilter> request)
        {
            var response = new BaseResponse<IList<ServiceOrderModel>>();
            var q = from so in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                    join r in unitOfWork.GetRepository<DC_Resident>().dbSet on so.ResidentID equals r.ResidentID
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet on r.PersonID equals p.PersonID
                    select new
                    {
                        so = so,
                        OrganizationID = r.OrganizationID,
                        ResidentNo = r.ResidentNo,
                        Sex = p.Sex,
                        PersonName = p.Name
                    };

            if (request != null)
            {
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }

                if (request.Data.ServiceOrderID != 0)
                {
                    q = q.Where(m => m.so.ServiceOrderID == request.Data.ServiceOrderID);
                }
                if (request.Data.ResidentID != 0)
                {
                    q = q.Where(m => m.so.ResidentID == request.Data.ResidentID);
                }
                if (!string.IsNullOrEmpty(request.Data.KeyWords))
                {
                    q = q.Where(m => m.so.SONo.Contains(request.Data.KeyWords) || m.PersonName.Contains(request.Data.KeyWords));
                }
                if (request.Data.PaymentStatus != null && request.Data.PaymentStatus.Length > 0)
                {
                    q = q.Where(m => request.Data.PaymentStatus.Contains(m.so.PaymentStatus));
                }
                if (request.Data.OrderStatus != null && request.Data.OrderStatus.Length > 0)
                {
                    q = q.Where(m => request.Data.OrderStatus.Contains(m.so.OrderStatus));
                }
                if (request.Data.IsDeleted.HasValue)
                {
                    q = q.Where(m => m.so.IsDeleted == request.Data.IsDeleted.Value);
                }

                if (request.Data.StartDate.HasValue)
                {
                    q = q.Where(m => m.so.CreatedTime >= request.Data.StartDate);
                }
                if (request.Data.EndDate.HasValue)
                {
                    request.Data.EndDate = request.Data.EndDate.Value.AddDays(1);
                    q = q.Where(m => m.so.CreatedTime < request.Data.EndDate);
                }

                if (request.Data.AppDate.HasValue)
                {
                    var fromDate = request.Data.AppDate.Value.Date;
                    var toDate = fromDate.AddDays(1);
                    q = q.Where(m => m.so.Otime < toDate && m.so.Otime >= fromDate);
                }

                if (request.Data.ServiceType.HasValue)
                {
                    q = q.Where(m => m.so.ServiceType == request.Data.ServiceType);
                }
            }
            q = q.OrderByDescending(m => m.so.CreatedTime);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<ServiceOrderModel>();
                foreach (dynamic item in list)
                {
                    var orderId = (int)item.so.ServiceOrderID;
                    var serviceOrder = Mapper.DynamicMap<ServiceOrderModel>(item.so);
                    serviceOrder.ResidentNo = item.ResidentNo;
                    serviceOrder.Sex = item.Sex;
                    serviceOrder.PersonName = item.PersonName;
                    serviceOrder.ServiceItems = Mapper.DynamicMap<List<SerOrdSerItModel>>(unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(m => m.ServiceOrderID == orderId).ToList());
                    newList.Add(serviceOrder);
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

        public BaseResponse<ServiceOrderModel> GetComOrder(int serviceOrderID)
        {
            BaseResponse<ServiceOrderModel> response = new BaseResponse<ServiceOrderModel>();
            var request = new BaseRequest<ServiceOrderFilter>()
            {
                Data = { ServiceOrderID = serviceOrderID }
            };
            var serviceOrderList = QueryComOrder(request);
            if (serviceOrderList.RecordsCount > 0)
            {
                response.Data = serviceOrderList.Data[0];
            }
            return response;
        }


        public BaseResponse<List<SerOrdSerItModel>> GetOrderItems(int serviceOrderID)
        {
            BaseResponse<List<SerOrdSerItModel>> response = new BaseResponse<List<SerOrdSerItModel>>();
            var q = from a in unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(m => m.ServiceOrderID == serviceOrderID)
                    join b in unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet on a.ServiceOrderSIID equals b.ServiceOrderSIID into rec
                    from c in rec.DefaultIfEmpty()
                    select new
                    {
                        ServiceItem = a,
                        CheckStatus = c.CheckStatus
                    };

            if (q.Count()>0)
            {
                response.Data = new List<SerOrdSerItModel>() ;
                var serviceItems =q.ToList();
                serviceItems.ForEach(a => {
                    var newItem = Mapper.DynamicMap<SerOrdSerItModel>(a.ServiceItem);
                    newItem.CheckStatus = a.CheckStatus;
                    response.Data.Add(newItem);
                });                
            }
            return response;
        }

        public BaseResponse<ServiceOrderModel> SaveOrder(ServiceOrderModel request)
        {
            var response = new BaseResponse<ServiceOrderModel>();
            var responseData = new List<ServiceOrderModel>();
            var serviceItemCategoryRepository = unitOfWork.GetRepository<DC_ServiceItemCategory>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var serOrdSerItRepository = unitOfWork.GetRepository<DC_SerOrdSerIt>();
            var serviceItemRepository = unitOfWork.GetRepository<DC_ServiceItem>();
            var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
            var orgRepository = unitOfWork.GetRepository<ORG_Organization>();

            unitOfWork.BeginTransaction();            

            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == request.ServiceOrderID);
            if (serviceOrder == null)
            {
                serviceOrder = Mapper.DynamicMap<DC_ServiceOrder>(request);
                serviceOrder.ServiceOrderID = int.Parse(base.GeneratePrimaryKeyValue(EnumCodeKey.ServiceOrder));
                if (String.IsNullOrEmpty(serviceOrder.SONo))
                {
                    serviceOrder.SONo = base.GeneratePrimaryKeyValue(EnumCodeKey.ServiceOrderCode);
                }
                serviceOrder.PaymentStatus = Enum.GetName(typeof(PaymentStatus), PaymentStatus.Unpaid);
                serviceOrder.OrderStatus = Enum.GetName(typeof(OrderStatus), OrderStatus.Wait);
                serviceOrder.OrderCreator = request.CreatedBy;
                serviceOrder.CreatedBy = request.CreatedBy;
                serviceOrder.CreatedTime = DateTime.Now;
                serviceOrder.ModifiedTime = DateTime.Now;
                serviceOrderRepository.Insert(serviceOrder);
            }
            else
            {
                Mapper.DynamicMap(request, serviceOrder);
                serviceOrder.ModifiedTime = DateTime.Now;
                serviceOrderRepository.Update(serviceOrder);
            }

            if (request.ServiceOrderID == 0 && request.ServiceItems != null && request.ServiceItems.Count>0)
            {
                var serialNo = 1;
                request.ServiceItems.ForEach(a => {
                    var serOrdSerIt = Mapper.DynamicMap<DC_SerOrdSerIt>(a);
                    serOrdSerIt.ServiceSerialNo = serialNo;
                    serOrdSerIt.ServiceOrderID = serviceOrder.ServiceOrderID;
                    serOrdSerIt.ChargeStatus = (int)ChargeStatus.Unpaid;
                    serOrdSerIt.CreatedBy = serviceOrder.OrderCreator.Value;
                    serOrdSerIt.CreatedTime = DateTime.Now;
                    serOrdSerItRepository.Insert(serOrdSerIt);
                    serialNo++;
                });
            }

            if (serviceOrder.ServiceAppID.HasValue)
            {
                var serApp = unitOfWork.GetRepository<DC_ServiceAppointment>().Get(serviceOrder.ServiceAppID);
                if (serApp!=null)
                {
                    serApp.Status = Enum.GetName(typeof(AppointmentStatus), AppointmentStatus.Ordered);
                    unitOfWork.GetRepository<DC_ServiceAppointment>().Update(serApp);
                }
            }

            unitOfWork.Commit();
            response.Data = Mapper.DynamicMap<ServiceOrderModel>(serviceOrder);
            var org = orgRepository.Get(request.OrganizationID);
            if (request.ServiceOrderID ==0 && org != null && !org.IsPayFirstFlag.Value)
            {
                var ordSerIt = unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(a => a.ServiceOrderID == serviceOrder.ServiceOrderID).Select(a => a.ServiceOrderSIID).ToList();
                var rs = SyncToCheckQueue(ordSerIt, serviceOrder.OrderCreator.Value);
            }
            return response;
        }

        public BaseResponse DeleteServiceOrder(int serviceOrderID)
        {
            return base.Delete<DC_ServiceOrder>(serviceOrderID);
        }

        public BaseResponse SyncToCheckQueue(IList<int> orderSiIds, int OperatorID)
        {
            var response = new BaseResponse();

            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var personRepository = unitOfWork.GetRepository<DC_Person>();
            var residentRepository = unitOfWork.GetRepository<DC_Resident>();
            var serviceItemRepository = unitOfWork.GetRepository<DC_ServiceItem>();
            var serOrdSerItRepository = unitOfWork.GetRepository<DC_SerOrdSerIt>();
            var empRepository = unitOfWork.GetRepository<ORG_Employee>();

            if (orderSiIds == null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "插入队列失败，找不到排队的项目";
                return response;
            }

            unitOfWork.BeginTransaction();

            //支付结果
            var m = from a in serOrdSerItRepository.dbSet.Where(a => orderSiIds.Contains(a.ServiceOrderSIID))
                               join b in serviceItemRepository.dbSet on a.ServiceItemID equals b.ServiceItemID
                               join c in serviceOrderRepository.dbSet on a.ServiceOrderID equals c.ServiceOrderID
                               join d in residentRepository.dbSet on c.ResidentID equals d.ResidentID
                               join e in personRepository.dbSet on d.PersonID equals e.PersonID
                               orderby a.ServiceOrderID descending,a.Priorit,a.ServiceSerialNo
                               select new
                               {
                                   SerOrdIt=a,
                                   ServiceOrder = c,
                                   DeptID = b.DeptId,
                                   b.OrganizationID,
                                   PersonName = e.Name
                               };
            var serviceItems = m.ToList();

            if (serviceItems != null && serviceItems.Count>0)
            {
                var hasInQueue = false;
                var waitStatus = (int)CheckStatus.WaitForCheck;
                var index = 0;
                serviceItems.ForEach(a => {
                    var serialNumber = "";
                    if (a.ServiceOrder.SONo != null && a.ServiceOrder.SONo.Length > 4)
                    {
                        serialNumber = "S" + a.ServiceOrder.SONo.Substring(a.ServiceOrder.SONo.Length - 4);
                    }

                    hasInQueue = unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet.Where(c => c.ResidentID == a.ServiceOrder.ResidentID && c.CheckStatus == waitStatus).Count() > 0;

                    var crqList = new List<DC_CheckRoomQueue>();
                    var crq = new DC_CheckRoomQueue();
                    crq.ServiceItemID = a.SerOrdIt.ServiceItemID;
                    crq.DeptId = a.DeptID;
                    crq.SIName = a.SerOrdIt.SIName;
                    crq.ResidentID = a.ServiceOrder.ResidentID;
                    crq.ResidentName = a.PersonName;
                    crq.SerialNumber = serialNumber;  //
                    if (index == 0 && !hasInQueue)
                    {
                        var maxNumber = unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet.Where(h => h.DeptId == a.DeptID).Max(c => c.CheckNumber);
                        maxNumber += 1;
                        crq.CheckNumber = maxNumber;  //
                        crq.CheckStatus = (int)CheckStatus.WaitForCheck;
                    }
                    else
                    {
                        crq.CheckNumber = 0;  //
                        crq.CheckStatus = (int)CheckStatus.Register;
                    }
                    crq.OrganizationID = a.OrganizationID;
                    crq.CreatedBy = OperatorID;
                    crq.CreatedTime = DateTime.Now;
                    crqList.Add(crq);

                    var crqRecor = unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet.Where(c => c.ServiceOrderSIID == a.SerOrdIt.ServiceOrderSIID).FirstOrDefault();
                    if (crqRecor!=null)
                    {
                        crqRecor.CheckStatus = (int)CheckStatus.Register;
                        crqRecor.ModifiedBy = OperatorID;
                        crqRecor.ModifiedTime = DateTime.Now;
                        crqRecor.DC_CheckRoomQueue = crqList;
                        unitOfWork.GetRepository<DC_CheckRoomQueueRec>().Update(crqRecor);
                    }
                    else
                    {
                        crqRecor = new DC_CheckRoomQueueRec();
                        crqRecor.ResidentID = a.ServiceOrder.ResidentID;
                        crqRecor.SerialNumber = serialNumber;
                        crqRecor.ServiceOrderID = a.SerOrdIt.ServiceOrderID;
                        crqRecor.ServiceOrderSIID = a.SerOrdIt.ServiceOrderSIID;
                        crqRecor.SchDate = a.ServiceOrder.Otime.Date;
                        crqRecor.PNCID = a.ServiceOrder.PNCID.Value;
                        crqRecor.DeptId = a.DeptID;
                        crqRecor.ServiceItemID = a.SerOrdIt.ServiceItemID;
                        crqRecor.CheckStatus = (int)CheckStatus.Register;
                        crqRecor.OrganizationID = a.OrganizationID;
                        crqRecor.CreatedBy = OperatorID;
                        crqRecor.CreatedTime = DateTime.Now;
                        crqRecor.IsDeleted = false;
                        crqRecor.DC_CheckRoomQueue = crqList;
                        unitOfWork.GetRepository<DC_CheckRoomQueueRec>().Insert(crqRecor);
                    }

                    if(a.SerOrdIt.ChargeStatus==(int)ChargeStatus.Refund){
                        a.SerOrdIt.ChargeStatus = (int)ChargeStatus.Unpaid;
                        unitOfWork.GetRepository<DC_SerOrdSerIt>().Update(a.SerOrdIt);
                    }

                    index++;
                });
            }

            unitOfWork.Commit();
            return response;
        }

        public BaseResponse RemoveFromCheckQueue(IList<int> orderSiIds, int OperatorID)
        {
            var response = new BaseResponse();

            if (orderSiIds!=null)
            {
                var orderSiIts = unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(a => orderSiIds.Contains(a.ServiceOrderSIID)).ToList();
                if (orderSiIts!=null)
                {
                    unitOfWork.BeginTransaction();
                    var rs = true;
                    var notAllowStatus = new int[2];
                    notAllowStatus[0] = (int)CheckStatus.InChecking;
                    notAllowStatus[1] = (int)CheckStatus.Finish;
                    orderSiIts.ForEach(a => 
                    {
                        var crqRec = unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet.Where(m => m.ServiceOrderSIID == a.ServiceOrderSIID).FirstOrDefault();
                        var hasNotAllowCrq = false;
                        if (crqRec.DC_CheckRoomQueue!=null)
                        {
                            var notAlowCrq = crqRec.DC_CheckRoomQueue.Where(m => notAllowStatus.Contains(m.CheckStatus));
                            hasNotAllowCrq = notAlowCrq.Count() > 0;
                        }

                        if (crqRec != null && (notAllowStatus.Contains(crqRec.CheckStatus) || hasNotAllowCrq))
                        {
                            response.IsSuccess = false;
                            response.ResultMessage = "项目【" + a.SIName + "】" + (crqRec.CheckStatus == (int)CheckStatus.InChecking?"正在进行中":"已经完成") + ",无法取消订单";
                            rs = false;
                            return ;
                        }

                        if (crqRec.DC_CheckRoomQueue != null && crqRec.DC_CheckRoomQueue.Count>0)
                        {
                            var crqList =crqRec.DC_CheckRoomQueue.ToList();
                            crqList.ForEach(crq=>
                            {
                                unitOfWork.GetRepository<DC_CheckRoomQueue>().Delete(crq);
                            });
                        }

                        crqRec.CheckStatus = (int)CheckStatus.Cancel;
                        crqRec.ModifiedBy = OperatorID;
                        crqRec.ModifiedTime = DateTime.Now;
                        unitOfWork.GetRepository<DC_CheckRoomQueueRec>().Update(crqRec);

                        a.ChargeStatus = (int)ChargeStatus.Refund;
                        a.ModifiedBy = OperatorID;
                        a.ModifiedTime = DateTime.Now;
                        unitOfWork.GetRepository<DC_SerOrdSerIt>().Update(a);
                    });

                    if(!rs){
                        return response;
                    }

                    unitOfWork.Commit();
                }
            }            

            return response;
        }

        public BaseResponse CancelOrder(int serviceOrderID,int operatorId)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var serOrdSerITRepository = unitOfWork.GetRepository<DC_SerOrdSerIt>();
            var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (serviceOrder == null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "该订单不存在，请联系管理员进行处理。";
                return response;
            }

            unitOfWork.BeginTransaction();
            
            var serOrdIts = serOrdSerITRepository.dbSet.Where(a => a.ServiceOrderID == serviceOrderID).Select(a=>a.ServiceOrderSIID).ToList();
            var rmRs = RemoveFromCheckQueue(serOrdIts,operatorId);

            if (!rmRs.IsSuccess)
            {
                return rmRs;
            }

            serviceOrder.IsCancelFlag = true;
            serviceOrder.PaymentStatus = null;
            serviceOrder.OrderStatus = null;
            serviceOrder.ModifiedTime = DateTime.Now;
            serviceOrderRepository.Update(serviceOrder);

            unitOfWork.Commit();
            return response;
        }


        #endregion
    }
}
