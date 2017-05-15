using System.Web.Http.Results;
using KMHC.Infrastructure;

namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;
    using KMHC.SLTC.WebAPI.Lib.Attribute;

    [RoutePrefix("api/User"), RoleBaseAuthorize]
    public class UserController : BaseApiController
    {
        IUserService service = IOCContainer.Instance.Resolve<IUserService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<UserFilter> request)
        {
            if (request != null)
            {
                request.Data.IsSupperAdmin = SecurityHelper.CurrentPrincipal.IsSurperAdmin;
                request.Data.IsGroupAdmin = SecurityHelper.CurrentPrincipal.IsGroupAdmin;
                request.Data.GroupId = SecurityHelper.CurrentPrincipal.GroupId;
            }
            var response = service.QueryUser(request);
            return Ok(response);
        }

        [Route("{userID}")]
        public IHttpActionResult Get(int userId)
        {
            var response = service.QueryUser(new BaseRequest<UserFilter>() { Data = new UserFilter() { UserID = userId, IsGroupAdmin = SecurityHelper.CurrentPrincipal.IsGroupAdmin, IsSupperAdmin = SecurityHelper.CurrentPrincipal.IsSurperAdmin, GroupId = SecurityHelper.CurrentPrincipal.GroupId } });
            return Ok(new BaseRequest<UserModel>() { Data = response.Data == null ? null : response.Data.FirstOrDefault() });
        }

        [Route("Login"), HttpPost]
        public IHttpActionResult Login(UserModel baseRequest)
        {
            var response = service.Login(baseRequest);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(UserModel baseRequest)
        {
            var user = SecurityHelper.CurrentPrincipal;
            if (baseRequest.OrganizationID == 0 && user != null)
            {
                baseRequest.OrganizationID = user.OrgId;
            }
            var response = service.SaveUser(baseRequest);
            return Ok(response);
        }

        [Route("{userID}")]
        public IHttpActionResult Delete(int userID)
        {
            var response = service.DeleteUser(userID);
            return Ok(response);
        }
    }
}
