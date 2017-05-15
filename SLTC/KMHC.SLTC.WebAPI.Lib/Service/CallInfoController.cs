using KMHC.Infrastructure;

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

    [RoutePrefix("api/callinfo"), RoleBaseAuthorize]
    public class CallInfoController : BaseApiController
    {
        ICallInfoService service = IOCContainer.Instance.Resolve<ICallInfoService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<CallInfoFilter> request)
        {
            var response = service.QueryCallInfo(request);
            return Ok(response);
        }

        [Route("{callInfoID}")]
        public IHttpActionResult Get(int callInfoID)
        {
            var response = service.GetCallInfo(callInfoID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(CallInfoModel baseRequest)
        {
            var response = service.SaveCallInfo(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteCallInfo(id);
            return Ok(response);
        }
    }
}
