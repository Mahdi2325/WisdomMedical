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

    [RoutePrefix("api/ServiceItem"), RoleBaseAuthorize]
    public class ServiceItemController : BaseApiController
    {
        IServiceItemService service = IOCContainer.Instance.Resolve<IServiceItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceItemFilter> request)
        {
            var response = service.QueryServiceItem(request);
            return Ok(response);
        }

        [Route("QueryServiceItemWithServicePlan"), HttpGet]
        public IHttpActionResult QueryServiceItemWithServicePlan([FromUri]BaseRequest<ServiceItemFilter> request)
        {
            var response = service.QueryServiceItemWithServicePlan(request);
            return Ok(response);
        }

        [Route("{serviceItemID}")]
        public IHttpActionResult Get(int serviceItemID)
        {
            var response = service.GetServiceItem(serviceItemID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceItemModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveServiceItem(baseRequest);
            return Ok(response);
        }

        [Route("{serviceItemID}")]
        public IHttpActionResult Delete(int serviceItemID)
        {
            var response = service.DeleteServiceItem(serviceItemID);
            return Ok(response);
        }
    }
}
