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
    [RoutePrefix("api/CommodityItem"), RoleBaseAuthorize]
    public class CommodityItemController : BaseApiController
    {
        ICommodityItemService service = IOCContainer.Instance.Resolve<ICommodityItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<CommodityItemFilter> request)
        {
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryCommodityItem(request);
            return Ok(response);
        }

        [Route("{commodityItemID}")]
        public IHttpActionResult Get(int commodityItemID)
        {
            var response = service.GetCommodityItem(commodityItemID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(CommodityItemModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveCommodityItem(baseRequest);
            return Ok(response);
        }

        [Route("{commodityItemID}")]
        public IHttpActionResult Delete(int commodityItemID)
        {
            var response = service.DeleteCommodityItem(commodityItemID);
            return Ok(response);
        }
    }
}
