using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Business.Interface.Report;
using KMHC.SLTC.WebAPI.Lib.Attribute;

namespace KMHC.SLTC.WebAPI.Lib.Report
{

    [RoutePrefix("api/EvaluationStatistic"), RoleBaseAuthorize]
    public class EvaluationStatisticController : BaseApiController
    {
        IEvaluationReportService service = IOCContainer.Instance.Resolve<IEvaluationReportService>();

        [Route("GetEvaluationSummary/{organizationID}/{employeeId}")]
        [HttpGet]
        public IHttpActionResult GetEvaluationSummary(int organizationId,int employeeId)
        {
            var response = service.GetEvaluationSummary(organizationId, employeeId);
            return Ok(response);
        }


    }
}
