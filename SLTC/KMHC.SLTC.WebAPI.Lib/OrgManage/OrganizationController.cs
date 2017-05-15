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

    [RoutePrefix("api/Organization"), RoleBaseAuthorize]
    public class OrganizationController : BaseApiController
    {
        IOrganizationService service = IOCContainer.Instance.Resolve<IOrganizationService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri] BaseRequest<OrganizationFilter> request)
        {
            request.Data.GroupID = SecurityHelper.CurrentPrincipal.GroupId;
            //非超级管理员和集团管理员只能看到自己所属的机构
            //request.Data.IsGroupAdmin = SecurityHelper.CurrentPrincipal.IsGroupAdmin;
            if (!SecurityHelper.CurrentPrincipal.IsSurperAdmin && !SecurityHelper.CurrentPrincipal.IsGroupAdmin)
            {
                request.Data.OrgIds = SecurityHelper.CurrentPrincipal.OrgIds;
            }
            var response = service.QueryOrganization(request);
            return Ok(response);
        }

        [Route("{organizationID}")]
        public IHttpActionResult Get(int organizationID)
        {
            if (organizationID<=0)
            {
                organizationID = SecurityHelper.CurrentPrincipal.OrgId;
            }
            var response = service.GetOrganization(organizationID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(OrganizationModel baseRequest)
        {
            var response = service.SaveOrganization(baseRequest);
            return Ok(response);
        }

        [Route("{organizationID}")]
        public IHttpActionResult Delete(int organizationID)
        {
            var response = service.DeleteOrganization(organizationID);
            return Ok(response);
        }
    }
}
