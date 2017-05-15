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
    [RoutePrefix("api/Dept"), RoleBaseAuthorize]
    public class DeptController : BaseApiController
    {
        IDeptService service = IOCContainer.Instance.Resolve<IDeptService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri] BaseRequest<DeptFilter> request)
        {
            if (request==null)
            {
                request = new BaseRequest<DeptFilter>();
            }
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryDept(request);
            return Ok(response);
        }

        [Route("{DeptID}")]
        public IHttpActionResult Get(int DeptID)
        {
            var response = service.GetDept(DeptID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(DeptModel baseRequest)
        {
            var response = service.SaveDept(baseRequest);
            return Ok(response);
        }

        [Route("{DeptID}")]
        public IHttpActionResult Delete(int DeptID)
        {
            var response = service.DeleteDept(DeptID);
            return Ok(response);
        }
    }
}
