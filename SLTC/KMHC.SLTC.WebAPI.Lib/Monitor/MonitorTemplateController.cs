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

    [RoutePrefix("api/monitortemplate"), RoleBaseAuthorize]
    public class MonitorTemplateController : BaseApiController
    {
        IMonitorTemplateService service = IOCContainer.Instance.Resolve<IMonitorTemplateService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<MonitorTemplateFilter> request = new BaseRequest<MonitorTemplateFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryMonitorTemplate(request);
            return Ok(response);
        }

        [Route("{monitorTemplateID}")]
        public IHttpActionResult Get(int monitorTemplateID)
        {
            var response = service.GetMonitorTemplate(monitorTemplateID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(MonitorTemplateModel baseRequest)
        {
            var response = service.SaveMonitorTemplate(baseRequest);
            return Ok(response);
        }

        [Route("{monitorTemplateID}")]
        public IHttpActionResult Delete(int monitorTemplateID)
        {
            var response = service.DeleteMonitorTemplate(monitorTemplateID);
            return Ok(response);
        }

        [Route(""), HttpGet]
        public IHttpActionResult Query()
        {
            BaseRequest<MonitorTemplateFilter> request = new BaseRequest<MonitorTemplateFilter>();
            //request.CurrentPage = currentPage;
            request.PageSize = 0;
            var response = service.QueryMonitorTemplate(request);
            return Ok(response.Data);
        }
    }
}
