using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.Charges
{
    [RoutePrefix("api/ChargeItem"), RoleBaseAuthorize]
    public class ChargeItemController : BaseApiController
    {
        IChargeItemService service = IOCContainer.Instance.Resolve<IChargeItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ChargeItemFilter> request)
        {
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryChargeItem(request);
            return Ok(response);
        }

        [Route("{chargeItemID}")]
        public IHttpActionResult Get(int chargeItemID)
        {
            var response = service.GetChargeItem(chargeItemID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ChargeItemModel baseRequest)
        {
            var response = service.SaveChargeItem(baseRequest);
            return Ok(response);
        }

        [Route("{chargeItemID}")]
        public IHttpActionResult Delete(int chargeItemID)
        {
            var response = service.DeleteChargeItem(chargeItemID);
            return Ok(response);
        }
    }
}
