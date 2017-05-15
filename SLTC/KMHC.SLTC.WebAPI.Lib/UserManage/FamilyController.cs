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

    [RoutePrefix("api/family"), RoleBaseAuthorize]
    public class FamilyController : BaseApiController
    {
        IFamilyService service = IOCContainer.Instance.Resolve<IFamilyService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<FamilyFilter> request)
        {
            var response = service.QueryFamily(request);
            return Ok(response);
        }

        [Route("{familyID}")]
        public IHttpActionResult Get(int familyID)
        {
            var response = service.GetFamily(familyID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(FamilyModel baseRequest)
        {
            var response = service.SaveFamily(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteFamily(id);
            return Ok(response);
        }
    }
}
