namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.Infrastructure;
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

    [RoutePrefix("api/Deposit"), RoleBaseAuthorize]
    public class DepositController : BaseApiController
    {
        IDepositService service = IOCContainer.Instance.Resolve<IDepositService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<DepositFilter> request)
        {
            if (request != null)
            {
                var response = service.QueryDeposit(request);
                return Ok(response);
            }
            else
            {
                return Ok();
            }
           
        }

        [Route("{residentID}")]
        public IHttpActionResult Get(int residentID)
        {
            var response = service.GetDeposit(residentID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(DepositModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveDeposit(baseRequest);
            return Ok(response);
        }

        [Route("{depositID}")]
        public IHttpActionResult Delete(int depositID)
        {
            var response = service.DeleteDeposit(depositID);
            return Ok(response);
        }
    }
}
