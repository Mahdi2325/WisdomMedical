namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KM.Common;
    using KMHC.Infrastructure;
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
    
    public partial class ServiceOrderService : BaseService, IServiceOrderService
    {
        #region DC_ServiceOrder
        public BaseResponse<IList<ServiceOrderModel>> QueryServiceOrder(BaseRequest<ServiceOrderFilter> request)
        {
            var wait = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
            var commodityType = Enum.GetName(typeof(OrderType), OrderType.Commodity);
            var response = new BaseResponse<IList<ServiceOrderModel>>();
            var refundRepository = from a in unitOfWork.GetRepository<DC_RefundRecord>().dbSet
                                       group a by a.ServiceOrderID into g
                                       select new
                                       {
                                           ServiceOrderID = g.Key,
                                           NumRefund = g.Count()
                                       };
            var AuditRefundRepository = from a in unitOfWork.GetRepository<DC_RefundRecord>().dbSet.Where(a=>a.Status == wait)
                                   group a by a.ServiceOrderID into g
                                   select new
                                   {
                                       ServiceOrderID = g.Key,
                                       NumRefund = g.Count()
                                   };

            var evaluationRepository = from a in unitOfWork.GetRepository<DC_Evaluation>().dbSet
                                   group a by a.ServiceOrderID into g
                                   select new
                                   {
                                       ServiceOrderID = g.Key,
                                       NumEva = g.Count()
                                   };

            var q = from so in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                    join r in unitOfWork.GetRepository<DC_Resident>().dbSet on so.ResidentID equals r.ResidentID
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet on r.PersonID equals p.PersonID
                    join h in refundRepository on so.ServiceOrderID equals h.ServiceOrderID into refund
                    from i in refund.DefaultIfEmpty()
                    join j in AuditRefundRepository on so.ServiceOrderID equals j.ServiceOrderID into auditRefund
                    from k in auditRefund.DefaultIfEmpty()
                    join o in unitOfWork.GetRepository<DC_Task>().dbSet on so.ServiceOrderID equals o.ServiceOrderID into taskInfo
                    from b in taskInfo.DefaultIfEmpty()
                    join m in unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet on so.ServiceOrderID equals m.ServiceOrderID into serviceItem
                    from n in serviceItem.DefaultIfEmpty()
                    join x in evaluationRepository on so.ServiceOrderID equals x.ServiceOrderID into evluation
                    from y in evluation.DefaultIfEmpty()
                    select new
                    {
                        so = so,
                        OrganizationID = r.OrganizationID,
                        ResidentNo = r.ResidentNo,
                        Sex = p.Sex,
                        PersonName = p.Name,
                        IsRefund = i.NumRefund > 0 && !so.IsDeleted,
                        IsNeedAuditRefund = k.NumRefund > 0 && !so.IsDeleted,
                        TaskStat = b.Status,
                        ServiceItemID = n.ServiceItemID,
                        SIName = n.SIName,
                        IsEva = y.NumEva>0
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
                    q = q.Where(m => m.so.SONo.Contains(request.Data.KeyWords)  || m.PersonName.Contains(request.Data.KeyWords));
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
            q = q.OrderByDescending(m =>  m.so.CreatedTime);
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
                    serviceOrder.IsRefund = item.IsRefund;
                    serviceOrder.IsNeedAuditRefund = item.IsNeedAuditRefund;
                    serviceOrder.TaskStatus = item.TaskStat;
                    serviceOrder.IsEva = item.IsEva;
                    if (item.so.OrderType == commodityType)
                    {
                        serviceOrder.CommodityItems = Mapper.DynamicMap<List<CommodityItemModel>>(unitOfWork.GetRepository<DC_OrderCItem>().dbSet.Where(m => m.ServiceOrderID == orderId).ToList());
                    }
                    else
                    {
                        var serviceItemID = (int)item.ServiceItemID;
                        var serviceItem = unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(m => m.ServiceItemID == serviceItemID).FirstOrDefault();
                        serviceOrder.ServiceItemID = item.ServiceItemID;
                        serviceOrder.SIName = item.SIName;
                        if (serviceItem!=null)
                        {
                            serviceOrder.Unit = serviceItem.Unit;
                            serviceOrder.OrderMode = serviceItem.OrderMode;
                        }
                    }
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

        public BaseResponse<ServiceOrderModel> GetServiceOrder(int serviceOrderID)
        {
            BaseResponse<ServiceOrderModel> response = new BaseResponse<ServiceOrderModel>();
            var request = new BaseRequest<ServiceOrderFilter>()
            {
                Data = { ServiceOrderID = serviceOrderID }
            };
            var serviceOrderList = QueryServiceOrder(request);
            if (serviceOrderList.RecordsCount > 0)
            {
                response.Data = serviceOrderList.Data[0];

                var task = unitOfWork.GetRepository<DC_Task>().dbSet.FirstOrDefault(a => a.ServiceOrderID == serviceOrderID);
                if (task!=null)
                {
                    response.Data.TaskStatus = task.Status;
                }

                var refund = unitOfWork.GetRepository<DC_RefundRecord>().dbSet.FirstOrDefault(a => a.ServiceOrderID == serviceOrderID);
                if (refund != null)
                {
                    response.Data.IsRefund = true;
                }

                if (response.Data.OrderType == Enum.GetName(typeof(OrderType), OrderType.Commodity))
                {
                    var q = unitOfWork.GetRepository<DC_OrderCItem>().dbSet.Where(m => m.ServiceOrderID == serviceOrderID);
                    response.Data.CommodityItems = Mapper.DynamicMap<List<CommodityItemModel>>(q.ToList());
                }
                else
                {
                    var serviceItem = unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(a => a.ServiceOrderID == serviceOrderID).FirstOrDefault();
                    if(serviceItem!=null){
                        response.Data.ServiceItemID = serviceItem.ServiceItemID;
                        response.Data.SIName = serviceItem.SIName;
                    }

                }
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
            var orderCItemRepository = unitOfWork.GetRepository<DC_OrderCItem>();

            int? servicePlantItemID = null;
            unitOfWork.BeginTransaction();
            //套餐预约时，需扣除套餐内次数
            if (request.OrderType == Enum.GetName(typeof(OrderType), OrderType.Group))
            {
                var nowDate = DateTime.Now;
                var servicePlanItem = new DC_ResidentServicePlanItem();
                if (request.ResidentServicePlanItemID.HasValue)
                {
                    var servicePlanRepository = from a in unitOfWork.GetRepository<DC_ResidentServicePlan>().dbSet.Where(a => a.ResidentID == request.ResidentID && a.SStartDate <= nowDate && a.SEndDate >= nowDate)
                                                join b in unitOfWork.GetRepository<DC_ResidentServicePlanItem>().dbSet.Where(a => a.RestTimes > 0 && a.ResidentServicePlanItemID == request.ResidentServicePlanItemID) on a.ResidentServicePlanID equals b.ResidentServicePlanID
                                                select b;
                    servicePlanItem = servicePlanRepository.FirstOrDefault();
                }
                else
                {
                    var servicePlanRepository = from a in unitOfWork.GetRepository<DC_ResidentServicePlan>().dbSet.Where(a => a.ResidentID == request.ResidentID && a.SStartDate <= nowDate && a.SEndDate >= nowDate)
                                                join b in unitOfWork.GetRepository<DC_ResidentServicePlanItem>().dbSet.Where(a => a.RestTimes > 0 && a.ServiceItemID == request.ServiceItemID) on a.ResidentServicePlanID equals b.ResidentServicePlanID
                                                select b;
                    servicePlanItem = servicePlanRepository.FirstOrDefault();
                }

                if (servicePlanItem != null)
                {
                    servicePlantItemID = servicePlanItem.ResidentServicePlanItemID;
                    servicePlanItem.RestTimes -= 1;
                    residentServicePlanItemRepository.Update(servicePlanItem);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "该项目的套餐内服务次数已经用完。";
                    return response;
                }
            }

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
                if (request.OrderType == Enum.GetName(typeof(OrderType), OrderType.Group))
                {
                    serviceOrder.ResidentServicePlanItemID = servicePlantItemID;
                }
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

            if (request.ServiceOrderID == 0)
            {
                if (request.OrderType == Enum.GetName(typeof(OrderType), OrderType.Commodity))
                {
                    if (request.CommodityItems != null)
                    {
                        request.CommodityItems.ForEach(a =>
                        {
                            var orderCItem = Mapper.DynamicMap<DC_OrderCItem>(a);
                            orderCItem.ServiceOrderID = serviceOrder.ServiceOrderID;
                            orderCItem.CreatedTime = DateTime.Now;
                            orderCItem.ModifiedTime = DateTime.Now;
                            orderCItemRepository.Insert(orderCItem);
                        });
                    }
                }
                else
                {
                    var serviceItem = serviceItemRepository.Get(request.ServiceItemID);
                    if (serviceItem != null)
                    {
                        var serOrdSerIt = Mapper.DynamicMap<DC_SerOrdSerIt>(serviceItem);
                        serOrdSerIt.ServiceOrderID = serviceOrder.ServiceOrderID;
                        serOrdSerIt.CreatedTime = DateTime.Now;
                        serOrdSerIt.ModifiedTime = DateTime.Now;
                        serOrdSerItRepository.Insert(serOrdSerIt);
                    }
                    else
                    {
                        response.IsSuccess = false;
                        response.ResultMessage = "该项目不存在。";
                        return response;
                    }
                }
            }

            unitOfWork.Commit();
            response.Data = Mapper.DynamicMap<ServiceOrderModel>(serviceOrder);

            return response;
        }

        public BaseResponse DeleteServiceOrder(int serviceOrderID)
        {
            return base.Delete<DC_ServiceOrder>(serviceOrderID);
        }

        public BaseResponse<ServiceOrderModel> OrderSettlement(int serviceOrderID, string payment)
        {
            var response = new BaseResponse<ServiceOrderModel>();

            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var feeDetailRepository = unitOfWork.GetRepository<DC_FeeDetail>();
            var taskRepository = unitOfWork.GetRepository<DC_Task>();
            var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
            var serviceItemRepository = unitOfWork.GetRepository<DC_ServiceItem>();
            var serviceItemCategoryRepository = unitOfWork.GetRepository<DC_ServiceItemCategory>();
            var serOrdSerItRepository = unitOfWork.GetRepository<DC_SerOrdSerIt>();
            var orderCItemRepository = unitOfWork.GetRepository<DC_OrderCItem>();
            var empRepository = unitOfWork.GetRepository<ORG_Employee>();

            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            unitOfWork.BeginTransaction();
            if (serviceOrder == null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "该订单不存在";
                return response;
            }
            else
            {
                serviceOrder.Payment = payment;
            }

            //支付结果
            IResidentService residentService = IOCContainer.Instance.Resolve<IResidentService>();
            var resident = residentService.GetResident(serviceOrder.ResidentID);

            //如果是会员卡支付,则校验会员卡余额
            var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == serviceOrder.ResidentID);
            if (serviceOrder.Price > 0 && serviceOrder.OrderType != Enum.GetName(typeof(OrderType), OrderType.Group) && payment == Enum.GetName(typeof(Payment), Payment.ResidentCard))
            {

                if (deposit != null)
                {
                    var remainingMoney = deposit.Amount - deposit.TotalConSpeMonth;
                    //支付成功
                    if (serviceOrder.Price <= remainingMoney)
                    {
                        deposit.TotalConSpeMonth = deposit.TotalConSpeMonth + serviceOrder.Price.Value;
                        depositRepository.Update(deposit);

                        var feeDetail = new DC_FeeDetail();
                        feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, resident.Data.OrganizationID);
                        feeDetail.ServiceOrderID = serviceOrder.ServiceOrderID;
                        feeDetail.FeeName = serviceOrder.OrderTitle;
                        feeDetail.TotalPrice = -1 * serviceOrder.Price;
                        feeDetail.FeeDate = DateTime.Now;
                        feeDetail.ResidentID = serviceOrder.ResidentID;
                        feeDetailRepository.Insert(feeDetail);
                    }
                    else
                    {
                        response.IsSuccess = false;
                    }
                }
                else
                {
                    response.IsSuccess = false;
                }                

                if (!response.IsSuccess)
                {
                    response.ResultMessage = "账户期初余额不足，请充值后再下单，或选择其他支付方式下单。";
                    return response;
                }
            }

            serviceOrder.PaymentStatus = serviceOrder.Payment == Enum.GetName(typeof(Payment), Payment.Cash) ? Enum.GetName(typeof(PaymentStatus), PaymentStatus.Unpaid) : Enum.GetName(typeof(PaymentStatus), PaymentStatus.Paid);

            serviceOrder.OrderStatus = Enum.GetName(typeof(OrderStatus), serviceOrder.SelEmployeeID.HasValue ? OrderStatus.Delivered : OrderStatus.Undelivered);


            //送货上门的情况下生成工单
            if (serviceOrder.OrderType == Enum.GetName(typeof(OrderType), OrderType.Commodity) && serviceOrder.Delivery == Enum.GetName(typeof(Delivery), Delivery.SelfPickup))
            {
                serviceOrder.OrderStatus = Enum.GetName(typeof(OrderStatus), OrderStatus.Delivered);
            }
            else
            {
                var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrder.ServiceOrderID);
                if (task == null)
                {
                    task = new DC_Task();
                    task.OrganizationID = resident.Data.OrganizationID;
                    task.TaskNo = base.GenerateCode(EnumCodeKey.TaskCode, EnumCodeRule.YearMonthDay, "T", 4, task.OrganizationID);
                    task.ServiceOrderID = serviceOrder.ServiceOrderID;
                    task.SONo = serviceOrder.SONo;
                    task.Price = serviceOrder.Price.Value;
                    task.AppointmentTime = serviceOrder.Otime;
                    task.Address = serviceOrder.ServiceAddress;
                    task.Lng = serviceOrder.Lng;
                    task.Lat = serviceOrder.Lat;
                    task.Remark = serviceOrder.Remark;
                    task.ServiceType = serviceOrder.OrderType;
                    task.ServiceName = serviceOrder.OrderTitle;
                    task.PersonID = resident.Data.PersonID;
                    task.PersonName = resident.Data.PersonName;
                    task.Sex = resident.Data.Sex;
                    task.Phone = serviceOrder.ContactPhone;
                    task.Status = Enum.GetName(typeof(TaskStatus), TaskStatus.Wait);
                    if (serviceOrder.SelEmployeeID.HasValue)
                    {
                        var emp = empRepository.Get(serviceOrder.SelEmployeeID.Value);
                        task.Status = Enum.GetName(typeof(TaskStatus), TaskStatus.Assign);
                        task.EmployeeId = serviceOrder.SelEmployeeID.Value;
                        task.EmployeeName = emp.EmpName;
                    }
                    task.CreatedBy = 0;
                    task.CreatedTime = DateTime.Now;
                    task.ModifiedTime = DateTime.Now;
                    taskRepository.Insert(task);
                }
                else
                {
                    task.Price = serviceOrder.Price;
                    task.AppointmentTime = serviceOrder.Otime;
                    task.Address = serviceOrder.ServiceAddress;
                    task.Lng = serviceOrder.Lng;
                    task.Lat = serviceOrder.Lat;
                    task.Remark = serviceOrder.Remark;
                    task.Phone = serviceOrder.ContactPhone;
                    task.ModifiedBy = 0;
                    task.ModifiedTime = DateTime.Now;
                    taskRepository.Update(task);
                }
            }

            serviceOrder.ModifiedTime = DateTime.Now;
            serviceOrderRepository.Update(serviceOrder);

            response.Data = Mapper.DynamicMap<ServiceOrderModel>(serviceOrder);
            unitOfWork.Commit();
            return response;
        }

        public BaseResponse CancelOrder(int serviceOrderID)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var taskRepository = unitOfWork.GetRepository<DC_Task>();
            var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (serviceOrder==null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "该订单不存在，请联系管理员进行处理。";
                return response;
            }

            //取消工单
            var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (task != null && task.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Execution))
            {
                response.IsSuccess = false;
                response.ResultMessage = "服务人员已签到，无法取消订单及退款，请联系管理员进行处理。";
                return response;
            }

            unitOfWork.BeginTransaction();
            serviceOrder.IsDeleted = true;
            serviceOrder.PaymentStatus = null;
            serviceOrder.OrderStatus = null;
            serviceOrder.ModifiedBy = 0;
            serviceOrder.ModifiedTime = DateTime.Now;

            if (task != null)
            {
                task.IsCancel = true;
                task.Status = null;
                task.ModifiedBy = 0;
                task.ModifiedTime = DateTime.Now;
                taskRepository.Update(task);
            }

            if (serviceOrder.OrderType == Enum.GetName(typeof(OrderType), OrderType.Group))
            {
                var servicePlanItem = residentServicePlanItemRepository.Get(serviceOrder.ResidentServicePlanItemID);
                if (servicePlanItem != null)
                {
                    servicePlanItem.RestTimes = (servicePlanItem.RestTimes.HasValue? (servicePlanItem.RestTimes+1):1);
                    residentServicePlanItemRepository.Update(servicePlanItem);
                }
            }

            unitOfWork.Commit();
            return response;
        }

        public BaseResponse ConfirmOrder(int serviceOrderID)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var taskRepository = unitOfWork.GetRepository<DC_Task>();
            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (serviceOrder == null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "该订单不存在，请联系管理员进行处理。";
                return response;
            }
            var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            unitOfWork.BeginTransaction();
            serviceOrder.PaymentStatus = Enum.GetName(typeof(PaymentStatus), PaymentStatus.Paid);
            serviceOrder.OrderStatus = Enum.GetName(typeof(OrderStatus), OrderStatus.Finish);
            serviceOrder.ModifiedBy = 0;
            serviceOrder.ModifiedTime = DateTime.Now;
            serviceOrderRepository.Update(serviceOrder);

            if (task!=null)
            {
                task.Status = Enum.GetName(typeof(TaskStatus), TaskStatus.Finish);
                task.EndTime = DateTime.Now;
                task.ModifiedTime = DateTime.Now;
                taskRepository.Update(task);
            }

            if (serviceOrder.Payment== Enum.GetName(typeof(Payment), Payment.Cash))
            {
                var resident = unitOfWork.GetRepository<DC_Resident>().Get(serviceOrder.ResidentID);
                var feeDetail = new DC_FeeDetail();
                feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, resident.OrganizationID.Value);
                feeDetail.ServiceOrderID = serviceOrder.ServiceOrderID;
                feeDetail.FeeName = serviceOrder.OrderTitle;
                feeDetail.TotalPrice = -1 * serviceOrder.Price;
                feeDetail.FeeDate = DateTime.Now;
                feeDetail.ResidentID = serviceOrder.ResidentID;
                unitOfWork.GetRepository<DC_FeeDetail>().Insert(feeDetail);
            }

            unitOfWork.Commit();
            return response;
        }

        public BaseResponse<List<EmpPlanModel>> GetDatePlan(EmpPlanFilter request)
        {
            BaseResponse<List<EmpPlanModel>> response = new BaseResponse<List<EmpPlanModel>>();
            List<EmpPlanModel> epList = new List<EmpPlanModel>();
            var taskRepository = unitOfWork.GetRepository<DC_Task>();
            var orderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();

            var user = base.unitOfWork.GetRepository<SYS_User>().dbSet;
            var ur = base.unitOfWork.GetRepository<SYS_UserRelation>().dbSet;
            var employee = base.unitOfWork.GetRepository<ORG_Employee>().dbSet;
            string userRelationType = Enum.GetName(typeof(UserRelationType), UserRelationType.UserEmployee);
            var query = from sysUser in user
                        join emprelation in ur on new { sysUser.UserID, RelationType = userRelationType, IsDeleted = false } equals new { emprelation.UserID, emprelation.RelationType, emprelation.IsDeleted } into eurd
                        from y in eurd.DefaultIfEmpty()
                        join empl in employee on new { Id = y.RelationID, IsDeleted = false } equals new { Id = empl.EmployeeID, empl.IsDeleted } into ee
                        from epd in ee.DefaultIfEmpty()
                        where sysUser.IsDeleted == false
                        select new { user = sysUser, emp = ee };
            query = query.Where(w => w.user.ORG_Organization.Any(a => a.OrganizationID == request.OrganizationID));
            query = query.Where(w => w.user.SYS_Role.Any(a => a.RoleNo != "R100" && a.RoleNo != "R001" && a.RoleNo != "R003"));
            var userList = query.ToList();

            for (var i = 0; i < 5; i++)
            {
                var timeStep = 0.5;
                var startTime = 8d;
                var endTime = 18;
                var isAllFullBook = true;

                var curDateTime = DateTime.Parse(DateTime.Now.ToString("yyyy-MM-dd")).AddDays(i);
                var curStartTime = startTime;
                var curEndTime = curStartTime + request.Quantity * request.Unit;
                var curStartDateTime = curDateTime.AddHours(curStartTime);
                var curEndDateTime = curDateTime.AddHours(curEndTime);
                EmpPlanModel ep = new EmpPlanModel();
                List<EmpPlanDateModel> epdList = new List<EmpPlanDateModel>();
                var userFressTimeList = new List<BeTimeModel>();

                for (var m = 0; m < userList.Count; m++)
                {
                    var emp = userList[m].emp.FirstOrDefault();
                    if (emp==null)
                    {
                        continue;
                    }
                    var q = from task in taskRepository.dbSet.Where(a=>a.EmployeeId == emp.EmployeeID && (a.Status == "Assign" || a.Status == "Execution"))
                            join order in orderRepository.dbSet on task.ServiceOrderID equals order.ServiceOrderID
                            select new
                            {
                                ServiceName = task.ServiceName,
                                AppointmentTime = task.AppointmentTime,
                                Quantity = order.Quantity
                            };
                    var userJobTimeList = new List<BeTimeModel>();
                    if (q!=null && q.Count() > 0)
                    {
                        var tempList = q.ToList(); 
                        var list = tempList.Where(a => a.AppointmentTime.Date.CompareTo(curDateTime.Date) == 0).ToList();
                        list.ForEach((a) =>
                        {
                            DateTime taskStartTime;
                            DateTime taskEndTime;
                            if (a.ServiceName == "家政服务" || a.ServiceName == "陪聊")
                            {
                                taskStartTime = a.AppointmentTime;
                                taskEndTime = a.AppointmentTime.AddHours(a.Quantity.Value);
                            }
                            else
                            {
                                taskStartTime = a.AppointmentTime;
                                taskEndTime = curDateTime.AddHours(endTime);
                            }
                            userJobTimeList.Add(new BeTimeModel
                            {
                                BeginTime = taskStartTime,
                                EndTime = taskEndTime
                            });
                        });
                    }

                    UnionTime(userJobTimeList);
                    DateTime freeTimeStart = curDateTime.AddHours(startTime);
                    DateTime freeTimeEnd;
                    userJobTimeList.ForEach(a =>
                    {
                        freeTimeEnd = a.BeginTime;
                        userFressTimeList.Add(new BeTimeModel
                        {
                            BeginTime = freeTimeStart,
                            EndTime = freeTimeEnd
                        });
                        freeTimeStart = a.EndTime;
                    });
                    freeTimeEnd = curDateTime.AddHours(endTime);
                    userFressTimeList.Add(new BeTimeModel
                    {
                        BeginTime = freeTimeStart,
                        EndTime = freeTimeEnd
                    });
                }

                do
                {
                    var q = userFressTimeList.Where(a => a.BeginTime.CompareTo(curStartDateTime) <= 0 && a.EndTime.CompareTo(curEndDateTime)>=0);
                    EmpPlanDateModel epd = new EmpPlanDateModel()
                    {
                        TimeStart = curStartDateTime.ToShortTimeString(),
                        TimeEnd = curEndDateTime.ToShortTimeString(),
                        IsFullBook = curStartDateTime.CompareTo(DateTime.Now)<0?true: q.Count()==0
                    };
                    if (!epd.IsFullBook)
                    {
                        isAllFullBook = false;
                    }
                    epdList.Add(epd);
                    curStartTime += timeStep;
                    curEndTime = curStartTime + request.Quantity * request.Unit;
                    curStartDateTime = curDateTime.AddHours(curStartTime);
                    curEndDateTime = curDateTime.AddHours(curEndTime);
                } while (curStartTime <= endTime);

                ep.BookDate = curDateTime.ToString("yyyy-MM-dd");
                ep.EmpPlanDateList = epdList;
                ep.IsFullBook = isAllFullBook;
                epList.Add(ep);
            }

            response.Data = epList;
            return response;
        }

        private void UnionTime(List<BeTimeModel> timeList)
        {
            //先对数据排序
            timeList = timeList.OrderBy(p => p.BeginTime).ToList<BeTimeModel>();
            for (int i = 0; i < timeList.Count - 1; i++)
            {
                int j = i + 1;
                if (timeList[i].EndTime >= timeList[j].BeginTime)
                {
                    //处理后一条数据的结束时间比前一条数据结束时间小的情况
                    if (timeList[i].EndTime >= timeList[j].EndTime)
                    {
                        timeList[j] = timeList[i];
                    }
                    else
                    {
                        timeList[j].BeginTime = timeList[i].BeginTime;
                    }
                    timeList[i] = null;
                }
                else
                {
                    i++;
                }
            }
        }

        public BaseResponse<List<RefundRecordModel>> GetRefundList(int ServiceOrderID)
        {
            BaseResponse<List<RefundRecordModel>> response = new BaseResponse<List<RefundRecordModel>>();
            var refundList = unitOfWork.GetRepository<DC_RefundRecord>().dbSet.Where(a => a.ServiceOrderID == ServiceOrderID).OrderBy(a=>a.CreateTime).ToList();
            response.Data = Mapper.DynamicMap <List<RefundRecordModel>>(refundList);
            return response;
        }

        public BaseResponse<RefundRecordModel> GetRefundInfo(int id)
        {
            return base.Get<DC_RefundRecord, RefundRecordModel>((q) => q.ID == id);
        }

        public BaseResponse<RefundRecordModel> GetAuditRefund(int ServiceOrderID)
        {

            var wait = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
            return base.Get<DC_RefundRecord, RefundRecordModel>((q) => q.ServiceOrderID == ServiceOrderID && q.Status == wait);
        }

        public BaseResponse<string> RefundApply(RefundRecordFilter filter)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                //查看工单状态
                var taskRepository = unitOfWork.GetRepository<DC_Task>();
                var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == filter.ServiceOrderID);
                if (task != null &&  task.Status==Enum.GetName(typeof(TaskStatus),TaskStatus.Execution))
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "服务人员已签到，无法取消订单及退款，请联系管理员进行处理";
                    return response;
                }

                unitOfWork.BeginTransaction();
                var orderModel = base.Get<DC_ServiceOrder, ServiceOrderModel>((q) => q.ServiceOrderID == filter.ServiceOrderID);
                if (orderModel != null)
                {
                    RefundRecordModel refundRecordModel = Mapper.DynamicMap<RefundRecordModel>(filter);
                    refundRecordModel.CreateBy = 0;
                    refundRecordModel.CreateTime = DateTime.Now;
                    refundRecordModel.ModifiedTime = DateTime.Now;
                    refundRecordModel.Status = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
                    base.Save<DC_RefundRecord, RefundRecordModel>(refundRecordModel, (q) => q.ID == refundRecordModel.ID);
                }
                else
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "该订单不存在，请联系管理员进行处理";
                    return response;
                }
                unitOfWork.Commit();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;                
                response.ResultMessage = ex.Message;
            }
            return response;
        }

        public BaseResponse AuditRefund(RefundRecordFilter filter)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            try
            {
                unitOfWork.BeginTransaction();
                var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
                var feeDetailRepository = unitOfWork.GetRepository<DC_FeeDetail>();
                var taskRepository = unitOfWork.GetRepository<DC_Task>();
                var refundRepository = unitOfWork.GetRepository<DC_RefundRecord>();
                var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
                var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == filter.ServiceOrderID);
                if (serviceOrder != null)
                {
                    //保存审核信息
                    var refund = refundRepository.dbSet.FirstOrDefault((q) => q.ID == filter.ID);
                    if (refund!=null)
                    {
                        refund.Status = filter.Status;
                        refund.Reply = filter.Reply;
                        refund.ModifiedBy = 0;
                        refund.ModifiedTime = DateTime.Now;
                        refundRepository.Update(refund);
                    }

                    //如果同意退款
                    if (filter.Status == Enum.GetName(typeof(RefundStatus), RefundStatus.Agree))
                    {
                        //取消订单
                        serviceOrder.IsDeleted = true;
                        serviceOrder.PaymentStatus = null;
                        serviceOrder.OrderStatus = null;
                        serviceOrder.ModifiedBy = 0;
                        serviceOrder.ModifiedTime = DateTime.Now;
                        serviceOrderRepository.Update(serviceOrder);

                        //退回金额
                        var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
                        var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == serviceOrder.ResidentID);
                        if(deposit!=null){
                            deposit.TotalConSpeMonth -= serviceOrder.Price.Value;
                            depositRepository.Update(deposit);
                        }

                        //取消工单
                        var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == filter.ServiceOrderID);
                        if (task != null)
                        {
                            task.IsCancel = true;
                            task.Status = null;
                            task.ModifiedBy = 0;
                            task.ModifiedTime = DateTime.Now;
                            taskRepository.Update(task);
                        }

                        if (serviceOrder.OrderType == Enum.GetName(typeof(OrderType), OrderType.Group))
                        {
                            var servicePlanItem = residentServicePlanItemRepository.Get(serviceOrder.ResidentServicePlanItemID);
                            if (servicePlanItem != null)
                            {
                                servicePlanItem.RestTimes = (servicePlanItem.RestTimes.HasValue ? (servicePlanItem.RestTimes + 1) : 1);
                                residentServicePlanItemRepository.Update(servicePlanItem);
                            }
                        }
                        else
                        {
                            //资金明细
                            var feeDetail = new DC_FeeDetail();
                            feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, filter.OrganizationID);
                            feeDetail.FeeName = "订单退款";
                            feeDetail.TotalPrice = serviceOrder.Price;
                            feeDetail.ResidentID = serviceOrder.ResidentID;
                            feeDetail.FeeDate = DateTime.Now;
                            feeDetailRepository.Insert(feeDetail);
                        }
                    }                    
                }
                else
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "该订单不存在，请联系管理员进行处理";
                    return response;
                }
                unitOfWork.Commit();
                response.IsSuccess = true;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ResultMessage = ex.Message;
            }
            return response;
        }

        public BaseResponse AdminCancelOrder(int serviceOrderID)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var feeDetailRepository = unitOfWork.GetRepository<DC_FeeDetail>();
            var taskRepository = unitOfWork.GetRepository<DC_Task>();
            var refundRepository = unitOfWork.GetRepository<DC_RefundRecord>();
            var residentRepository = unitOfWork.GetRepository<DC_Resident>();
            var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
            var serviceOrder = serviceOrderRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (serviceOrder == null)
            {
                response.IsSuccess = false;
                response.ResultMessage = "该订单不存在，请联系管理员进行处理";
                return response;
            }

            unitOfWork.BeginTransaction();

            //取消工单
            var task = taskRepository.dbSet.FirstOrDefault((q) => q.ServiceOrderID == serviceOrderID);
            if (task != null)
            {
                task.IsCancel = true;
                task.Status = null;
                task.ModifiedBy = 0;
                task.ModifiedTime = DateTime.Now;
                taskRepository.Update(task);
            }

            //如果是用会员卡支付并且已经支付成功
            if (serviceOrder.Payment == Enum.GetName(typeof(Payment), Payment.ResidentCard) && serviceOrder.PaymentStatus == Enum.GetName(typeof(PaymentStatus), PaymentStatus.Paid))
            {
                //退回金额
                var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
                var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == serviceOrder.ResidentID);
                if (deposit != null)
                {
                    deposit.TotalConSpeMonth -= serviceOrder.Price.Value;
                    depositRepository.Update(deposit);
                }
                if (serviceOrder.OrderType != Enum.GetName(typeof(OrderType), OrderType.Group))
                {
                    //资金明细
                    var feeDetail = new DC_FeeDetail();
                    feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, SecurityHelper.CurrentPrincipal.OrgId);
                    feeDetail.FeeName = "订单退款";
                    feeDetail.TotalPrice = serviceOrder.Price;
                    feeDetail.ResidentID = serviceOrder.ResidentID;
                    feeDetail.FeeDate = DateTime.Now;
                    feeDetailRepository.Insert(feeDetail);
                }
            }

            serviceOrder.IsDeleted = true;
            serviceOrder.PaymentStatus = null;
            serviceOrder.OrderStatus = null;
            serviceOrder.ModifiedBy = 0;
            serviceOrder.ModifiedTime = DateTime.Now;
            serviceOrderRepository.Update(serviceOrder);

            if (serviceOrder.OrderType == Enum.GetName(typeof(OrderType), OrderType.Group))
            {
                var servicePlanItem = residentServicePlanItemRepository.Get(serviceOrder.ResidentServicePlanItemID);
                if (servicePlanItem != null)
                {
                    servicePlanItem.RestTimes = (servicePlanItem.RestTimes.HasValue ? (servicePlanItem.RestTimes + 1) : 1);
                    residentServicePlanItemRepository.Update(servicePlanItem);
                }
            }

            unitOfWork.Commit();
            return response;
        }
        #endregion
    }
}
