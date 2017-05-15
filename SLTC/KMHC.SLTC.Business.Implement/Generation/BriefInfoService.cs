using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;

using KMHC.Infrastructure.Common;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Model.Home;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Persistence;
using NPOI.SS.Formula.Functions;

namespace KMHC.SLTC.Business.Implement
{
    public class BriefInfoService : BaseService, IBriefInfoService
    {

        public BaseResponse<BriefInfoModel> GetBriefInfo(int organizationID)
        {
            string waitStatus = EnumHelper.GetDescription(TaskStatus.Wait);
            string assignStatus = EnumHelper.GetDescription(TaskStatus.Assign);                     

            int unDistributeTaskCount = (from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationID
                                      && a.Status == waitStatus)
                select t.TaskID).Count();

            // only today not tomorrow
            var tomorrow = DateTime.Today.AddDays(1);
            int todayUnDealTaskCount = (from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationID
                                      && a.Status == assignStatus && a.AppointmentTime >= DateTime.Today && a.AppointmentTime < tomorrow)
                select t.TaskID).Count();

            int historyUnDealTaskCount = (from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationID
                                      && a.Status == assignStatus && a.AppointmentTime < DateTime.Today
                                      && a.AppointmentTime > DateTime.MinValue)
                select t.TaskID).Count();


            var briefInfo = new BriefInfoModel()
            {
                UnDistributeTaskCount = unDistributeTaskCount,
                TodayUnDealTaskCount = todayUnDealTaskCount,
                HistoryUnDealTaskCount = historyUnDealTaskCount,
                RequireReturnVisitTaskCount = GetRequireReturnVisitTaskCount(organizationID),
                NeedAuditRefundOrderCount = GetNeedAuditRefundOrderCount(organizationID),
                SelfPickupOrderCount = GetSelfPickupOrderCount(organizationID),
                NeedChangeAuditOrderCount = GetNeedChangeAuditTaskCount(organizationID)
            };

            BaseResponse<BriefInfoModel> response = new BaseResponse<BriefInfoModel>();
            response.Data = briefInfo;

            return response;
        }

        public BaseResponse<TodayInfoModel> GetTodayInfo(int organizationId)
        {
            var info = new TodayInfoModel()
            {
                ResidentNumber = GetTodayResidentNumber(organizationId),
                OrderNumber = GetOrderNumber(organizationId),
                TaskNubmer = GetTaskNumber(organizationId),
                OrderAmount = GetOrderAmount(organizationId)

            };

            BaseResponse<TodayInfoModel> response = new BaseResponse<TodayInfoModel>();
            response.Data = info;

            return response;
        }

        private decimal? GetOrderAmount(int organizationId)
        {
            var paid = EnumHelper.GetDescription(PaymentStatus.Paid);
            var q = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationId)
                join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                    .dbSet.Where(a => a.IsDeleted == false && a.PaymentStatus == paid
                                      && a.CreatedTime > DateTime.Today) on resident.ResidentID equals order.ResidentID
                select new
                {
                    price = order.Price
                };

            return q.Sum(a => a.price) ?? 0;
        }
        private int GetTaskNumber(int organizationId)
        {
            var q = from r in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false
                                      && a.OrganizationID == organizationId && a.CreatedTime > DateTime.Today)
                select new
                {
                    taskId = r.TaskID
                };

            return q.Distinct().Count();
        }

        private int GetOrderNumber(int organizationId)
        {
            var paid = EnumHelper.GetDescription(PaymentStatus.Paid);
            var q = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationId)
                join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                    .dbSet.Where(a => a.IsDeleted == false && a.PaymentStatus == paid
                                      && a.CreatedTime > DateTime.Today) on resident.ResidentID equals order.ResidentID
                select new
                {
                    serviceOrderId = order.ServiceOrderID
                };

            return q.Distinct().Count();
        }
        private int GetTodayResidentNumber(int organizationId)
        {
            var q = from r in unitOfWork.GetRepository<DC_Resident>()
                .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationId &&
                                  a.CreatedTime > DateTime.Today) select new
            {
                residentId = r.ResidentID
            };

            return q.Distinct().Count();
        }
        private int GetRequireReturnVisitTaskCount(int organizationID)
        {
            string finishStatus = EnumHelper.GetDescription(TaskStatus.Finish);

            var serviceOrderIdSet = unitOfWork.GetRepository<DC_Evaluation>()
                .dbSet.Select(i => i.ServiceOrderID);

            return (from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationID
                                      && a.Status == finishStatus
                                      && serviceOrderIdSet.Contains(a.ServiceOrderID) == false)
                    select t.TaskID).Count();

        }

        private int GetNeedAuditRefundOrderCount(int organizationID)
        {
            string refundWaitStatus = EnumHelper.GetDescription(RefundStatus.Wait);

            var auditRefundRepository = from a in unitOfWork.GetRepository<DC_RefundRecord>()
                    .dbSet.Where(a => a.Status == refundWaitStatus)
                group a by a.ServiceOrderID
                into g
                select new
                {
                    ServiceOrderID = g.Key,
                    NumRefund = g.Count()
                };

            var q = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationID)
                    join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                        .dbSet.Where(a => a.IsDeleted == false ) on resident.ResidentID equals order.ResidentID
                    join rf in auditRefundRepository.Where(a => a.NumRefund > 0 ) on order.ServiceOrderID equals rf.ServiceOrderID into refundOrder
                    from ro in refundOrder.DefaultIfEmpty()
                    select new
                    {
                        ServiceOrderID = ro.ServiceOrderID
                    };

            return q.Distinct().Count();
        }

        private int GetSelfPickupOrderCount(int organizationID)
        {
            string orderFinishStatus = EnumHelper.GetDescription(OrderStatus.Finish);
            string selfPickup = EnumHelper.GetDescription(Delivery.SelfPickup);
            string paidStatus = EnumHelper.GetDescription(PaymentStatus.Paid);
            string residentCard = EnumHelper.GetDescription(Payment.ResidentCard);
            string cash = EnumHelper.GetDescription(Payment.Cash);

            var q = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationID)
                    join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                        .dbSet.Where(a => a.IsDeleted == false) on resident.ResidentID equals order.ResidentID
                    join service in unitOfWork.GetRepository<DC_ServiceOrder>()
                        .dbSet
                        .Where(a => a.IsDeleted == false && a.OrderStatus != orderFinishStatus &&
                                    a.Delivery == selfPickup && (a.Payment == residentCard || a.Payment == cash) &&
                                    a.PaymentStatus == paidStatus)
                    on order.ServiceOrderID equals service.ServiceOrderID into selfPickUp
                    from s in selfPickUp.DefaultIfEmpty()
                    select new
                    {
                        ServiceOrderID = s.ServiceOrderID
                    };


            return q.Distinct().Count();

        }

        private int GetNeedChangeAuditTaskCount(int organizationID)
        {
            string assignTaskStatus = EnumHelper.GetDescription(TaskStatus.Assign);

            var taskChangeRecordIdSet = unitOfWork.GetRepository<DC_TaskChangeRecord>()
                .dbSet.Where(a => !a.IsDeleted && !a.IsAudit.Value);

            var q = from t in unitOfWork.GetRepository<DC_Task>().dbSet.Where(i => i.IsCancel == false && i.Status == assignTaskStatus && i.OrganizationID == organizationID)
                join m in taskChangeRecordIdSet on t.TaskID equals m.TaskID into taskChange
                from n in taskChange.DefaultIfEmpty()
                select new 
                {
                    TaskID=n.TaskID               
                };


            return q.Distinct().Count();
        }
    }
}
