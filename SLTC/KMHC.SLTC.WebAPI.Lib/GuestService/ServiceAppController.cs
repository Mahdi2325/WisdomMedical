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

    [RoutePrefix("api/ServiceApp"), RoleBaseAuthorize]
    public class ServiceAppController : BaseApiController
    {
        IServiceAppService service = IOCContainer.Instance.Resolve<IServiceAppService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceAppFilter> request)
        {
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryServiceApp(request);
            return Ok(response);
        }

        [Route("{serviceOrderID}")]
        public IHttpActionResult Get(int serviceAppID)
        {
            var response = service.GetServiceApp(serviceAppID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceAppointmentModel baseRequest)
        {
            var response = service.SaveServiceApp(baseRequest);
            return Ok(response);
        }

        [Route("CancelApp"), HttpGet]
        public IHttpActionResult CancelApp(int serviceAppID)
        {
            var response = service.CancelApp(serviceAppID);
            return Ok(response);
        }
        [Route("GetPNCList"), HttpGet]
        public IHttpActionResult GetPNCList(DateTime date)
        {
            var response = service.GetPNCList(date);
            return Ok(response);
        }
    }
}
