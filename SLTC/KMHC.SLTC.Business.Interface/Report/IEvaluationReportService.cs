using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Report;

namespace KMHC.SLTC.Business.Interface.Report
{
    public interface IEvaluationReportService : IBaseService
    {
        BaseResponse<IList<EvaluationSummaryModel>> GetEvaluationSummary(int organizationId, int employeeId);

    }
}
