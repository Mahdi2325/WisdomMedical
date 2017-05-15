using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/BriefInfo"), RoleBaseAuthorize]
    public class BriefInfoController : BaseApiController
    {
        IBriefInfoService service = IOCContainer.Instance.Resolve<IBriefInfoService>();


        [Route("GetBriefInfo/{organizationId}")]
        [HttpGet]
        public IHttpActionResult GetBriefInfo(int organizationId)
        {
            var response = service.GetBriefInfo(organizationId);
            return Ok(response);
        }

        [Route("GetTodayInfo/{organizationId}")]
        [HttpGet]
        public IHttpActionResult GetTodayInfo(int organizationId)
        {
            var response = service.GetTodayInfo(organizationId);
            return Ok(response);
        }
    }


}
