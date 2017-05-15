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

    [RoutePrefix("api/GroupActivityCategoryEdit"), RoleBaseAuthorize]
    public class GroupActivityCategoryEditController : BaseApiController
    {
        IGroupActivityCategoryEditService service = IOCContainer.Instance.Resolve<IGroupActivityCategoryEditService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<GroupActivityCategoryFilter> request)
        {
            var response = service.QueryGroupActivity(request);
            return Ok(response);
        }

        [Route(""), HttpGet]
        public IHttpActionResult Get(int serviceGroupID)
        {
            var response = service.GetGroupActivityCategory(serviceGroupID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(GroupActivityCategory baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveGroupActivityCategory(baseRequest);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Delete(int serviceGroupID)
        {
            var response = service.DeleteGroupActivityCategory(serviceGroupID);
            return Ok(response);
        }

        [Route("SaveActivityItems"),HttpPost]
        public IHttpActionResult SaveActivityItems([FromBody]IList<GroupActivityItem> baseRequest)
        {
            var response = service.SaveActivityItems(baseRequest);
            return Ok(response);
        }
    }
}
