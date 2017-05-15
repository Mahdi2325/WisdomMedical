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

    [RoutePrefix("api/ServiceGroup")]
    public class ServiceGroupController : ApiController
    {
        IServiceGroupService service = IOCContainer.Instance.Resolve<IServiceGroupService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int orgId,int currentPage=1,int pageSize=10,string keywords="")
        {
            var request = new BaseRequest<ServiceGroupFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            request.Data.OrganizationID = orgId;
            request.Data.Status = "启用";
            request.Data.KeyWords = keywords;
            var response = service.QueryServiceGroup(request);
            return Ok(response);
        }

        [Route("{serviceGroupID}")]
        public IHttpActionResult Get(int serviceGroupID)
        {
            var response = service.GetServiceGroup(serviceGroupID);
            return Ok(response);
        }

        /// <summary>
        /// 获取首页热点套餐
        /// </summary>
        /// <param name="residentID"></param>
        /// <param name="OrganizationID"></param>
        /// <returns></returns>
        [Route("GetHotGroups"), HttpGet]
        public IHttpActionResult GetHotServiceGroups(int organizationID, int fetchCnt)
        {
            var response = service.QueryHotServiceGroup(organizationID, fetchCnt);
            return Ok(response);
        }
    }
}
