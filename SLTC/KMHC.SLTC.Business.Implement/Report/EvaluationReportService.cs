using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Report;
using KMHC.SLTC.Business.Interface.Report;
using KMHC.SLTC.Persistence;
using KMHC.SLTC.Repository.Base;

namespace KMHC.SLTC.Business.Implement.Report
{
    public class EvaluationReportService:IEvaluationReportService
    {
        public IUnitOfWork unitOfWork = IOCContainer.Instance.Resolve<IUnitOfWork>();
        public BaseResponse<IList<EvaluationSummaryModel>> GetEvaluationSummary(int organizationId, int employeeId)
        {
            var monthRepository = from e in unitOfWork.GetRepository<DC_Evaluation>()
                    .dbSet.Where(a => a.Mark != null && a.CreateTime != null && a.CreateTime > DateTime.MinValue)
                select new
                {
                    Year = e.CreateTime.Value.Year,
                    Month = e.CreateTime.Value.Month,
                    Mark = e.Mark.Value,
                    EmployeeId = e.EmployeeID
                };

            var yMonth = from m in monthRepository.ToList()
                select new
                {
                    YMonth = m.Year + "." + m.Month,
                    Mark = m.Mark,
                    EmployeeId = m.EmployeeId
                };

            var q = from y in yMonth.GroupBy(a => a.YMonth)

                select new EvaluationSummaryModel()
                {
                    Month = y.Key,
                    AvgMark = y.Average(a => a.Mark),
                    PersonalAvgMark = (y.Count(a => a.EmployeeId == employeeId) == 0 ? 0 : y.Where(a => a.EmployeeId == employeeId).Average(a => a.Mark)),
                };

            return new BaseResponse<IList<EvaluationSummaryModel>>()
            {
                Data = q.ToList()
            };

        }
    }
}
