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

    [RoutePrefix("api/CodeRule"), RoleBaseAuthorize]
    public class CodeRuleController : BaseApiController
    {
        ICodeRuleService service = IOCContainer.Instance.Resolve<ICodeRuleService>();

        [Route("")]
        public IHttpActionResult Get([FromUri]CodeRuleFilter request)
        {
            var response = new BaseResponse<string>();
            response.Data = service.GenerateCodeRule(request);
            return Ok(response);
        }
    }
}
