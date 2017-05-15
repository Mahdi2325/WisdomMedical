using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.InteropServices;
using System.Text;
using System.Threading.Tasks;
using KM.Common;
using KMHC.Infrastructure.Common;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Report;
using KMHC.SLTC.Business.Interface.Report;
using KMHC.SLTC.Persistence;
using KMHC.SLTC.Repository.Base;

namespace KMHC.SLTC.Business.Implement.Report
{
    public class OrderReportService : IOrderReportService
    {
        public IUnitOfWork unitOfWork = IOCContainer.Instance.Resolve<IUnitOfWork>();

        public BaseResponse<IList<OrderSummaryModel>> GetOrderSummaryDistribute(int organizationId)
        {
            string finish = EnumHelper.GetDescription(Entity.TaskStatus.Finish);

            var monthRepository = from s in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.Status == finish && a.CreatedTime != null
                        && a.CreatedTime > DateTime.MinValue && a.OrganizationID == organizationId && a.EmployeeId != null)
                select new
                {
                    Year = s.CreatedTime.Year,
                    Month = s.CreatedTime.Month,
                };

            var monthlySet = from m in monthRepository.ToList()
                select new {YMonth = m.Year + "." + m.Month};
            
            var q = from m in  monthlySet.GroupBy(a=>a.YMonth)
                select new OrderSummaryModel()
                {
                    Month = m.Key,
                    Count = m.Count()
                };

            return new BaseResponse<IList<OrderSummaryModel>>()
            {
                Data = q.ToList()
            };
        }

        public BaseResponse<IList<PersonalOrderModel>> GetPersonalOrderDistribute(int organizationId, int employeeId)
        {
            string finish = EnumHelper.GetDescription(Entity.TaskStatus.Finish);

            var monthRepository = from s in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.Status == finish && a.CreatedTime != null && a.CreatedTime > DateTime.MinValue
                        && a.OrganizationID == organizationId && a.EmployeeId == employeeId)
                select new
                {
                    Year = s.CreatedTime.Year,
                    Month = s.CreatedTime.Month,
                    EmployeeId=s.EmployeeId
                };

            var monthlySet = from m in monthRepository.ToList()
                        select new
                            {
                                Month = m.Year + "." + m.Month
                            };
            var q = from m in monthlySet.GroupBy(a => a.Month)
                select new PersonalOrderModel
                {
                    Month = m.Key,
                    Count = m.Count()
                };


            return new BaseResponse<IList<PersonalOrderModel>>()
            {
                Data = q.ToList()
            };

        }

        public BaseResponse<OrderTaskRateModel> GetOrderTaskRate(int organizationId)
        {
            var finish = EnumHelper.GetDescription(OrderStatus.Finish);
            var taskFinish = EnumHelper.GetDescription(Entity.TaskStatus.Finish);

            var q = from s in unitOfWork.GetRepository<DC_ServiceOrder>()
                    .dbSet.Where(a => a.IsDeleted == false
                                      && a.OrderStatus == finish)
                 join r in unitOfWork.GetRepository<DC_Resident>().dbSet.Where(a=>a.IsDeleted == false
                     && a.OrganizationID == organizationId) on s.ResidentID equals r.ResidentID
                select new
                {
                    ServiceOrderId = s.ServiceOrderID
                };

            var p = from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false
                                      && a.Status == taskFinish && a.OrganizationID == organizationId)
                select new
                {
                    TaskId = t.TaskID
                };

            var rateModel = new OrderTaskRateModel()
            {
                OrderCount = q.Distinct().Count(),
                TaskCount = p.Distinct().Count()
            };

            return new BaseResponse<OrderTaskRateModel>()
            {
                Data = rateModel
            };
        }
    }
}
