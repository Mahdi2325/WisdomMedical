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

    [RoutePrefix("api/monitoritem"), RoleBaseAuthorize]
    public class MonitorItemController : BaseApiController
    {
        IMonitorItemService service = IOCContainer.Instance.Resolve<IMonitorItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<MonitorItemFilter> request = new BaseRequest<MonitorItemFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryMonitorItem(request);
            return Ok(response);
        }

        [Route("{monitoritemID}")]
        public IHttpActionResult Get(int monitoritemID)
        {
            var response = service.GetMonitorItem(monitoritemID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(MonitorItemModel baseRequest)
        {
            var response = service.SaveMonitorItem(baseRequest);
            return Ok(response);
        }

        [Route("{monitoritemID}")]
        public IHttpActionResult Delete(int monitoritemID)
        {
            var response = service.DeleteMonitorItem(monitoritemID);
            return Ok(response);
        }

        [Route(""), HttpGet]
        public IHttpActionResult Query()
        {
            BaseRequest<MonitorItemFilter> request = new BaseRequest<MonitorItemFilter>();
            request.PageSize = 0;
            var response = service.QueryMonitorItem(request);
            return Ok(response.Data);
        }
    }
}
