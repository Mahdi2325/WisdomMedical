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

    [RoutePrefix("api/Dictionary"), RoleBaseAuthorize]
    public class DictionaryController : BaseApiController
    {
        IDictionaryService service = IOCContainer.Instance.Resolve<IDictionaryService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<DictionaryFilter> request)
        {
            var response = service.QueryDictionary(request);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Get(int id)
        {
            var response = service.GetDictionary(id);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(DictionaryModel baseRequest)
        {
            var response = service.SaveDictionary(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteDictionary(id);
            return Ok(response);
        }

        [Route("Batch")]
        public IHttpActionResult Post(List<DictionaryModel> baseRequest)
        {
            var response = service.SaveBatchDictionary(baseRequest);
            return Ok(response);
        }
    }
}
