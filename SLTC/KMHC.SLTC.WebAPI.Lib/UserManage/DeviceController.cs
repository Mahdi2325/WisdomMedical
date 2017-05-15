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

    [RoutePrefix("api/device"), RoleBaseAuthorize]
    public class DeviceController : BaseApiController
    {
        IDeviceService service = IOCContainer.Instance.Resolve<IDeviceService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<DeviceFilter> request)
        {
            var response = service.QueryDevice(request);
            return Ok(response);
        }

        [Route("{deviceID}")]
        public IHttpActionResult Get(int deviceID)
        {
            var response = service.GetDevice(deviceID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(DeviceModel baseRequest)
        {
            var response = service.SaveDevice(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteDevice(id);
            return Ok(response);
        }
    }
}
