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

    [RoutePrefix("api/WatchRecord"), RoleBaseAuthorize]
    public class WatchRecordController : BaseApiController
    {
        IWatchRecordService service = IOCContainer.Instance.Resolve<IWatchRecordService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<WatchRecordFilter> request = new BaseRequest<WatchRecordFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryWatchRecord(request);
            return Ok(response);
        }

        [Route("{watchRecordID}")]
        public IHttpActionResult Get(int watchRecordID)
        {
            var response = service.GetWatchRecord(watchRecordID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(WatchRecordModel baseRequest)
        {
            var response = service.SaveWatchRecord(baseRequest);
            return Ok(response);
        }

        [Route("{watchRecordID}")]
        public IHttpActionResult Delete(int watchRecordID)
        {
            var response = service.DeleteWatchRecord(watchRecordID);
            return Ok(response);
        }
    }
}
