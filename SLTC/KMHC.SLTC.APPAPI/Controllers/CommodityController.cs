namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.Infrastructure;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/commodity")]
    public class CommodityController : ApiController
    {
        ICommodityTypeService typeService = IOCContainer.Instance.Resolve<ICommodityTypeService>();
        ICommodityItemService itemService = IOCContainer.Instance.Resolve<ICommodityItemService>();

        [Route("GetAllCommodityType"), HttpGet]
        public IHttpActionResult GetAllCommodityType(int orgId, int currentPage = 1, int pageSize = 10)
        {
            var request = new BaseRequest<CommodityTypeFilter>();
            request.Data.OrganizationID = orgId;
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = typeService.QueryCommodityType(request);
            return Ok(response);
        }

        [Route("GetCommodityItems")]
        public IHttpActionResult GetCommodityItems(int orgId, int? commodityTypeID = null, string name = "", int currentPage = 1, int pageSize = 10)
        {
            var request = new BaseRequest<CommodityItemFilter>();
            request.Data.OrganizationID = orgId;
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            request.Data.CIName = name;
            request.Data.CICategory = commodityTypeID;
            var response = itemService.QueryCommodityItem(request);
            return Ok(response);
        }


        [Route("GetCommodityDetail")]
        public IHttpActionResult GetCommodityDetail(int commodityItemID)
        {
            var response = itemService.GetCommodityItem(commodityItemID);
            return Ok(response);
        }
    }
}
