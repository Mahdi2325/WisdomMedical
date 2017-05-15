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

    [RoutePrefix("api/Room"), RoleBaseAuthorize]
    public class RoomController : BaseApiController
    {
        IRoomService service = IOCContainer.Instance.Resolve<IRoomService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<RoomFilter> request = new BaseRequest<RoomFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryRoom(request);
            return Ok(response);
        }

        [Route("{roomID}")]
        public IHttpActionResult Get(int roomID)
        {
            var response = service.GetRoom(roomID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(RoomModel baseRequest)
        {
            var response = service.SaveRoom(baseRequest);
            return Ok(response);
        }

        [Route("{roomID}")]
        public IHttpActionResult Delete(int roomID)
        {
            var response = service.DeleteRoom(roomID);
            return Ok(response);
        }
    }
}
