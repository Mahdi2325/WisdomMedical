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

    [RoutePrefix("api/contract"), RoleBaseAuthorize]
    public class ContractController : BaseApiController
    {
        IContractService service = IOCContainer.Instance.Resolve<IContractService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ContractFilter> request)
        {
            var response = service.QueryContract(request);
            return Ok(response);
        }

        [Route("{contractID}")]
        public IHttpActionResult Get(int contractID)
        {
            var response = service.GetContract(contractID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ContractModel baseRequest)
        {
            if (baseRequest.ID==0)
            {
                baseRequest.CreatedBy = SecurityHelper.CurrentPrincipal.UserId;
                baseRequest.CreatedTime = DateTime.Now;
            }
            else
            {
                baseRequest.ModifiedBy = SecurityHelper.CurrentPrincipal.UserId;
                baseRequest.ModifiedTime = DateTime.Now;
            }
            var response = service.SaveContract(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteContract(id);
            return Ok(response);
        }
    }
}
