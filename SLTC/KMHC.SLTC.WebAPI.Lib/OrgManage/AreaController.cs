using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.OrgManage
{
    [RoutePrefix("api/Area"), RoleBaseAuthorize]
    public class AreaController : BaseApiController
    {
        IAreaService service = IOCContainer.Instance.Resolve<IAreaService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri] BaseRequest<AreaFilter> request)
        {
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryArea(request);
            return Ok(response);
        }

        [Route("{areaID}")]
        public IHttpActionResult Get(int areaID)
        {
            var response = service.GetArea(areaID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(AreaModel baseRequest)
        {
            var response = service.SaveArea(baseRequest);
            return Ok(response);
        }

        [Route("{areaID}")]
        public IHttpActionResult Delete(int areaID)
        {
            var response = service.DeleteArea(areaID);
            return Ok(response);
        }
    }
}
