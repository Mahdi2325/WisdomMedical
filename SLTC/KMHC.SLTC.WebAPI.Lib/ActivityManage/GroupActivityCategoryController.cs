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

    [RoutePrefix("api/GroupActivityCategory"), RoleBaseAuthorize]
    public class GroupActivityCategoryController : BaseApiController
    {
        IGroupActivityCategoryService service = IOCContainer.Instance.Resolve<IGroupActivityCategoryService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<GroupActivityCategoryFilter> request)
        {
            if (request==null)
            {
                request = new BaseRequest<GroupActivityCategoryFilter>();
                request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            }
            var response = service.QueryGroupActivity(request);
            return Ok(response);
        }

        //[Route("{serviceGroupID}")]
        //public IHttpActionResult Get(int serviceGroupID)
        //{
        //    var response = service.GetServiceGroup(serviceGroupID);
        //    return Ok(response);
        //}

        //[Route("")]
        //public IHttpActionResult Post(ServiceGroupModel baseRequest)
        //{
        //    baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
        //    var response = service.SaveServiceGroup(baseRequest);
        //    return Ok(response);
        //}

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteGroupActivityCategory(id);
            return Ok(response);
        }
    }
}
