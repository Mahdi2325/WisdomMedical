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

    [RoutePrefix("api/Floor"), RoleBaseAuthorize]
    public class FloorController : BaseApiController
    {
        IFloorService service = IOCContainer.Instance.Resolve<IFloorService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<FloorFilter> request = new BaseRequest<FloorFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryFloor(request);
            return Ok(response);
        }

        [Route("{floorID}")]
        public IHttpActionResult Get(int floorID)
        {
            var response = service.GetFloor(floorID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(FloorModel baseRequest)
        {
            var response = service.SaveFloor(baseRequest);
            return Ok(response);
        }

        [Route("{floorID}")]
        public IHttpActionResult Delete(int floorID)
        {
            var response = service.DeleteFloor(floorID);
            return Ok(response);
        }
    }
}
