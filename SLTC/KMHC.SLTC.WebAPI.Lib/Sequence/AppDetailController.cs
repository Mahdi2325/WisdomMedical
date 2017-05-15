using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using KMHC.SLTC.Business.Entity.Base;
using System.Linq;

namespace KMHC.SLTC.WebAPI.Lib.Sequence
{
    [RoutePrefix("api/appointDtl"), RoleBaseAuthorize]
    public class AppDetailController : BaseApiController 
    {
        IAppStatisticsService service = IOCContainer.Instance.Resolve<IAppStatisticsService>();

        [Route("GetappointDetail/{sevItem}/{dt}/{period}")]
        [HttpGet]
        public IHttpActionResult GetappointDetail(string sevItem, DateTime dt, string period)
        {
            var response = service.GetAppPeopleBySevAndTime(sevItem, dt, period);
            return Ok(response);
        }
    }
}
