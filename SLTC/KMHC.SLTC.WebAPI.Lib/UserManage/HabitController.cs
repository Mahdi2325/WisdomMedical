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

    [RoutePrefix("api/habit"), RoleBaseAuthorize]
    public class HabitController : BaseApiController
    {
        IHabitService service = IOCContainer.Instance.Resolve<IHabitService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<HabitFilter> request)
        {
            var response = service.QueryHabit(request);
            return Ok(response);
        }

        [Route("{habitID}")]
        public IHttpActionResult Get(int habitID)
        {
            var response = service.GetHabit(habitID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(HabitModel baseRequest)
        {
            var response = service.SaveHabit(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteHabit(id);
            return Ok(response);
        }
    }
}
