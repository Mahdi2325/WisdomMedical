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

    [RoutePrefix("api/Bed"), RoleBaseAuthorize]
    public class BedController : BaseApiController
    {
        IBedService service = IOCContainer.Instance.Resolve<IBedService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<BedFilter> request = new BaseRequest<BedFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryBed(request);
            return Ok(response);
        }

        [Route("{bedID}")]
        public IHttpActionResult Get(int bedID)
        {
            var response = service.GetBed(bedID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(BedModel baseRequest)
        {
            var response = service.SaveBed(baseRequest);
            return Ok(response);
        }

        [Route("{bedID}")]
        public IHttpActionResult Delete(int bedID)
        {
            var response = service.DeleteBed(bedID);
            return Ok(response);
        }
    }
}
