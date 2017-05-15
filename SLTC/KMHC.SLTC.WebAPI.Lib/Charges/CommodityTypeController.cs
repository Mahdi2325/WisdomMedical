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

    [RoutePrefix("api/CommodityType"), RoleBaseAuthorize]
    public class CommodityTypeController : BaseApiController
    {
        ICommodityTypeService service = IOCContainer.Instance.Resolve<ICommodityTypeService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<CommodityTypeFilter> request)
        {
            if (request==null)
            {
                request = new BaseRequest<CommodityTypeFilter>();
                request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            }
            var response = service.QueryCommodityType(request);
            return Ok(response);
        }

        [Route("{commodityTypeID}")]
        public IHttpActionResult Get(int commodityTypeID)
        {
            var response = service.GetCommodityType(commodityTypeID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(CommodityTypeModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveCommodityType(baseRequest);
            return Ok(response);
        }

        [Route("{commodityTypeID}")]
        public IHttpActionResult Delete(int commodityTypeID)
        {
            var response = service.DeleteCommodityType(commodityTypeID);
            return Ok(response);
        }
    }
}
