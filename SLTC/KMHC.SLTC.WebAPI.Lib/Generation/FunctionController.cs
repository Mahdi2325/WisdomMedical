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

    [RoutePrefix("api/Function"), RoleBaseAuthorize]
    public class FunctionController : BaseApiController
    {
        IFunctionService service = IOCContainer.Instance.Resolve<IFunctionService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<FunctionFilter> request)
        {
            var response = service.QueryFunction(request);
            return Ok(response);
        }

        [Route("{functionID}")]
        public IHttpActionResult Get(int functionID)
        {
            var response = service.GetFunction(functionID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(FunctionModel baseRequest)
        {
            var response = service.SaveFunction(baseRequest);
            return Ok(response);
        }

        [Route("{functionID}")]
        public IHttpActionResult Delete(int functionID)
        {
            var response = service.DeleteFunction(functionID);
            return Ok(response);
        }

        [Route("Batch")]
        public IHttpActionResult Post(List<FunctionModel> baseRequest)
        {
            var response = service.SaveBatchFunction(baseRequest);
            return Ok(response);
        }
    }
}
