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

    [RoutePrefix("api/priorityRemark"), RoleBaseAuthorize]
    public class PriorityRemarkController : BaseApiController
    {
        IPriorityRemarkService service = IOCContainer.Instance.Resolve<IPriorityRemarkService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<PriorityRemarkFilter> request)
        {
            var response = service.QueryPriorityRemark(request);
            return Ok(response);
        }

        [Route("{priorityRemarkID}")]
        public IHttpActionResult Get(int priorityRemarkID)
        {
            var response = service.GetPriorityRemark(priorityRemarkID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(PriorityRemarkModel baseRequest)
        {
            var response = service.SavePriorityRemark(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeletePriorityRemark(id);
            return Ok(response);
        }
    }
}
