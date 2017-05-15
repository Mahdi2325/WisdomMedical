using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;

namespace KMHC.SLTC.WebAPI.Lib.Report
{

    [RoutePrefix("api/MainStatistic"), RoleBaseAuthorize]
    public class MainStatisticController : BaseApiController
    {
        IReportManageService service = IOCContainer.Instance.Resolve<IReportManageService>();

        [Route("GetResidentPercentage/{organizationID}")]
        [HttpGet]
        public IHttpActionResult GetResidentPercentage(int organizationId)
        {
            var response = service.GetResidentPercentage(organizationId);
            return Ok(response);
        }

        [Route("GetTop10Service/{organizationID}")]
        [HttpGet]
        public IHttpActionResult GetTop10Service(int organizationId)
        {
            var response = service.GetTop10Service(organizationId);
            return Ok(response);
        }

        [Route("GetPaymentDistribute/{organizationID}")]
        [HttpGet]
        public IHttpActionResult GetPaymentDistribute(int organizationId)
        {
            var response = service.GetPaymentDistribute(organizationId);
            return Ok(response);
        }

        [Route("GetResidentAgeDistribute/{organizationID}")]
        [HttpGet]
        public IHttpActionResult GetResidentAgeDistribute(int organizationId)
        {
            var response = service.GetResidentAgeDistribute(organizationId);
            return Ok(response);
        }
    }
}
