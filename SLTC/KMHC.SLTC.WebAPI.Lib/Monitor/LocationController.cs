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

    [RoutePrefix("api/Location"), RoleBaseAuthorize]
    public class LocationController : BaseApiController
    {
        [Route("Resident"), HttpGet]
        public IHttpActionResult QueryResident([FromUri]BaseRequest<ResidentFilter> request)
        {
            IResidentService service = IOCContainer.Instance.Resolve<IResidentService>();
            var response = service.QueryResident(request);
            return Ok(response);
        }


        [Route("StartTask"), HttpGet]
        public IHttpActionResult QueryStartTask([FromUri]BaseRequest<TaskFilter> request)
        {
            ITaskService service = IOCContainer.Instance.Resolve<ITaskService>();
            var response = service.QueryTask(request);
            return Ok(response);
        }


        [Route("EndTask"), HttpGet]
        public IHttpActionResult QueryEndTask([FromUri]BaseRequest<TaskFilter> request)
        {
            ITaskService service = IOCContainer.Instance.Resolve<ITaskService>();
            var response = service.QueryTask(request);
            return Ok(response);
        }
    }
}
