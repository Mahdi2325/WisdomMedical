using KMHC.Infrastructure;

namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.WebAPI.Lib.Attribute;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/Role"), RoleBaseAuthorize]
    public class RoleController : BaseApiController
    {
        IRoleService service = IOCContainer.Instance.Resolve<IRoleService>();

        [Route("QueryRoles"), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<RoleFilter> request)
        {
            var response = service.QueryRole(request); 
            return Ok(response); 
        }

        [Route("{roleID}")]
        public IHttpActionResult Get(int roleId)
        {
            var response = service.GetRole(roleId);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(RoleModel baseRequest)
        {
            var response = service.SaveRole(baseRequest);
            return Ok(response);
        }

        [Route("{roleID}")]
        public IHttpActionResult Delete(int roleID)
        {
            var response = service.DeleteRole(roleID);
            return Ok(response);
        }

        [Route(""), HttpGet]
        public IHttpActionResult Query()
        {
            var request = new RoleFunctionFilter { RoleID = SecurityHelper.CurrentPrincipal.RoleId, IsSuperAdmin = SecurityHelper.CurrentPrincipal.IsSurperAdmin};
            if (SecurityHelper.CurrentPrincipal.IsSurperAdmin)
            {
                var response = service.GetRoleFunction(request).ToList();
                return Ok(response);
            }
            else
            {
                var response = service.GetRoleMenu(request).ToList();
                return Ok(response);
            }           
           
        }
    }
}
