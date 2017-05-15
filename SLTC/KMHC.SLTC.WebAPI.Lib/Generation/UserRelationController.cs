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

    [RoutePrefix("api/UserRelation"), RoleBaseAuthorize]
    public class UserRelationController : BaseApiController
    {
        IUserRelationService service = IOCContainer.Instance.Resolve<IUserRelationService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<UserRelationFilter> request = new BaseRequest<UserRelationFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryUserRelation(request);
            return Ok(response);
        }

        [Route("{userRelationID}")]
        public IHttpActionResult Get(int userRelationID)
        {
            var response = service.GetUserRelation(userRelationID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(UserRelationModel baseRequest)
        {
            var response = service.SaveUserRelation(baseRequest);
            return Ok(response);
        }

        [Route("{userRelationID}")]
        public IHttpActionResult Delete(int userRelationID)
        {
            var response = service.DeleteUserRelation(userRelationID);
            return Ok(response);
        }
    }
}
