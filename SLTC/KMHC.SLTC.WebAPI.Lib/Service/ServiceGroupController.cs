namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.Infrastructure;
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

    [RoutePrefix("api/ServiceGroup"), RoleBaseAuthorize]
    public class ServiceGroupController : BaseApiController
    {
        IServiceGroupService service = IOCContainer.Instance.Resolve<IServiceGroupService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceGroupFilter> request)
        {
            var response = service.QueryServiceGroup(request);
            return Ok(response);
        }

        [Route("{serviceGroupID}")]
        public IHttpActionResult Get(int serviceGroupID)
        {
            var response = service.GetServiceGroup(serviceGroupID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceGroupModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveServiceGroup(baseRequest);
            return Ok(response);
        }

        [Route("{serviceGroupID}")]
        public IHttpActionResult Delete(int serviceGroupID)
        {
            var response = service.DeleteServiceGroup(serviceGroupID);
            return Ok(response);
        }
    }
}
