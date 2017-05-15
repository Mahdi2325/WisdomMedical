using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.APPAPI.Filters;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/Service")]
   // [JWTAuthentication]
    public class ServiceController : ApiController
    {
        IServiceItemService service = IOCContainer.Instance.Resolve<IServiceItemService>();
        IChargeItemService chargeItemService = IOCContainer.Instance.Resolve<IChargeItemService>();
        IServiceItemCategoryService catagoryService = IOCContainer.Instance.Resolve<IServiceItemCategoryService>();
        /// <summary>
        /// 获取服务列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route(""), HttpPost]
        public IHttpActionResult Query([FromBody]BaseRequest<ServiceItemFilter> request)
        {
            var response = service.QueryServiceItem(request);
            return Ok(response);
        }
        /// <summary>
        /// 获取服务项目详情
        /// </summary>
        /// <param name="serviceItemID"></param>
        /// <returns></returns>
        [Route("")]
        public IHttpActionResult Get(int serviceItemID)
        {
            var response = service.GetServiceItem(serviceItemID);
            return Ok(response);
        }
        /// <summary>
        /// 获取机构下的所有分类及服务项目
        /// </summary>
        /// <param name="serviceItemID"></param>
        /// <returns></returns>
        [Route("GetServiceCategoryAndItem"),HttpGet]
        public IHttpActionResult GetServiceCategoryAndItem(int OrganizationID)
        {
            var response = service.QueryServiceCategoryAndItem(OrganizationID);
            return Ok(response);
        }

        /// <summary>
        /// 获取机构下的所有分类
        /// </summary>
        /// <param name="serviceItemID"></param>
        /// <returns></returns>
        [Route("GetServiceCategory"), HttpGet]
        public IHttpActionResult GetServiceCategory(int orgId)
        {
            var request = new BaseRequest<ServiceItemCategoryFilter>();
            request.Data.OrganizationID = orgId;
            var response = catagoryService.QueryServiceItemCategory(request);
            return Ok(response);
        }

        /// <summary>
        /// 获取首页常用项目以及热点项目
        /// </summary>
        /// <param name="residentID"></param>
        /// <param name="OrganizationID"></param>
        /// <returns></returns>
        [Route("GetHotService"), HttpGet]
        public IHttpActionResult GetHotServiceItems(int organizationID,int fetchCnt)
        {
            var response = service.QueryHotServiceItem(organizationID, fetchCnt);
            return Ok(response);
        }

        /// <summary>
        /// 获取菜篮子详情
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        [Route("GetCommodityDetail"), HttpGet]
        public IHttpActionResult GetCommodityDetail(int id)
        {
            var response = chargeItemService.GetChargeItem(id);
            return Ok(response);
        }
    }
}
