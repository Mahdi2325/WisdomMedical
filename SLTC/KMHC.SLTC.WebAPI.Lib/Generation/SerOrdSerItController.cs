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

    [RoutePrefix("api/SerOrdSerIt"), RoleBaseAuthorize]
    public class SerOrdSerItController : BaseApiController
    {
        ISerOrdSerItService service = IOCContainer.Instance.Resolve<ISerOrdSerItService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<SerOrdSerItFilter> request = new BaseRequest<SerOrdSerItFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QuerySerOrdSerIt(request);
            return Ok(response);
        }

        [Route("{serviceOrderSIID}")]
        public IHttpActionResult Get(int serviceOrderSIID)
        {
            var response = service.GetSerOrdSerIt(serviceOrderSIID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(SerOrdSerItModel baseRequest)
        {
            var response = service.SaveSerOrdSerIt(baseRequest);
            return Ok(response);
        }

        [Route("{serviceOrderSIID}")]
        public IHttpActionResult Delete(int serviceOrderSIID)
        {
            var response = service.DeleteSerOrdSerIt(serviceOrderSIID);
            return Ok(response);
        }
    }
}
