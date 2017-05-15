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

    [RoutePrefix("api/monitorresult"), RoleBaseAuthorize]
    public class MonitorResultController : BaseApiController
    {
        IMonitorResultService service = IOCContainer.Instance.Resolve<IMonitorResultService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<MonitorResultFilter> request = new BaseRequest<MonitorResultFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryMonitorResult(request);
            return Ok(response);
        }

        [Route("{monitorResultID}")]
        public IHttpActionResult Get(int monitorResultID)
        {
            var response = service.GetMonitorResult(monitorResultID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(MonitorResultModel baseRequest)
        {
            var response = service.SaveMonitorResult(baseRequest);
            return Ok(response);
        }

        [Route("{monitorResultID}")]
        public IHttpActionResult Delete(int monitorResultID)
        {
            var response = service.DeleteMonitorResult(monitorResultID);
            return Ok(response);
        }

        [Route(""), HttpGet]
        public IHttpActionResult Query()
        {
            BaseRequest<MonitorResultFilter> request = new BaseRequest<MonitorResultFilter>();
            //request.CurrentPage = currentPage;
            request.PageSize = 0;
            var response = service.QueryMonitorResult(request);
            return Ok(response.Data);
        }
    }
}
