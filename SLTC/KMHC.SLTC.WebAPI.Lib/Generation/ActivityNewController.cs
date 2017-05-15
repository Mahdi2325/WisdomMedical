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

    [RoutePrefix("api/ActivityNew"), RoleBaseAuthorize]
    public class ActivityNewController : BaseApiController
    {
        IActivityNewService service = IOCContainer.Instance.Resolve<IActivityNewService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<ActivityNewFilter> request = new BaseRequest<ActivityNewFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryActivityNew(request);
            return Ok(response);
        }

        [Route("{activityNewID}")]
        public IHttpActionResult Get(int activityNewID)
        {
            var response = service.GetActivityNew(activityNewID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ActivityNewModel baseRequest)
        {
            var response = service.SaveActivityNew(baseRequest);
            return Ok(response);
        }

        [Route("{activityNewID}")]
        public IHttpActionResult Delete(int activityNewID)
        {
            var response = service.DeleteActivityNew(activityNewID);
            return Ok(response);
        }
    }
}
