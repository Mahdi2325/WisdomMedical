using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Business.Interface.Report;
using KMHC.SLTC.WebAPI.Lib.Attribute;

namespace KMHC.SLTC.WebAPI.Lib.Report
{
    [RoutePrefix("api/OrderStatistic"),RoleBaseAuthorize ]
    public class OrderStatisticController : BaseApiController
    {
        IOrderReportService service = IOCContainer.Instance.Resolve<IOrderReportService>();

        [Route("GetOrderSummary/{organizationID}")]
        [HttpGet]
        public IHttpActionResult GetOrderSummary(int organizationId)
        {
            var response = service.GetOrderSummaryDistribute(organizationId);
            return Ok(response);
        }


        [Route("GetPersonalOrderDistribute/{organizationID}/{employeeId}")]
        [HttpGet]
        public IHttpActionResult GetPersonalOrderDistribute(int organizationId, int employeeId)
        {
            var response = service.GetPersonalOrderDistribute(organizationId, employeeId);
            return Ok(response);
        }

        [Route("GetOrderTaskRate/{organizationID}")]
        public IHttpActionResult GetOrderTaskRate(int organizationId)
        {
            var response = service.GetOrderTaskRate(organizationId);
            return Ok(response);
        }
    }
}
