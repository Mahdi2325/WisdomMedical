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

    [RoutePrefix("api/ServiceItemCategory"), RoleBaseAuthorize]
    public class ServiceItemCategoryController : BaseApiController
    {
        IServiceItemCategoryService service = IOCContainer.Instance.Resolve<IServiceItemCategoryService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceItemCategoryFilter> request)
        {
            if (request==null)
            {
                request = new BaseRequest<ServiceItemCategoryFilter>();
                request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            }
            var response = service.QueryServiceItemCategory(request);
            return Ok(response);
        }

        [Route("{serviceItemCategoryID}")]
        public IHttpActionResult Get(int serviceItemCategoryID)
        {
            var response = service.GetServiceItemCategory(serviceItemCategoryID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceItemCategoryModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveServiceItemCategory(baseRequest);
            return Ok(response);
        }

        [Route("{serviceItemCategoryID}")]
        public IHttpActionResult Delete(int serviceItemCategoryID)
        {
            var response = service.DeleteServiceItemCategory(serviceItemCategoryID);
            return Ok(response);
        }
    }
}
