using KM.Common;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Http.Controllers;


namespace KMHC.SLTC.APPAPI.Filters
{

    /// <summary>
    /// 安全验证
    /// </summary>
    public class BasicAuthenticationAttribute : AuthorizeAttribute
    {
        IUserService service = IOCContainer.Instance.Resolve<IUserService>();
        public override void OnAuthorization(HttpActionContext actionContext)
        {
            if (SkipAuthorization(actionContext))
            {
                return;
            }
            var authHeader = actionContext.Request.Headers.FirstOrDefault(a => a.Key == "Authorization");

            if (actionContext.Request.Headers == null || !actionContext.Request.Headers.Any() || authHeader.Key == null || string.IsNullOrEmpty(authHeader.Value.FirstOrDefault()))
            {
                if (AllowAllUser(actionContext))
                    return;

                Throw401Exception(actionContext, "缺少Authorization头信息!");
            }

            string authorization = authHeader.Value.FirstOrDefault();
            authorization = authorization.Replace("Basic ", "");
            var encoding = Encoding.GetEncoding("iso-8859-1");
            authorization = encoding.GetString(Convert.FromBase64String(authorization));
            int separator = authorization.IndexOf(':');
            string userName = authorization.Substring(0, separator);
            string userPassword = authorization.Substring(separator + 1);
            ClientUserData user = null;
            var IsSuccess = service.Login(userName, userPassword, out user);
            if (IsSuccess)
            {
                actionContext.Request.Properties.Remove("AuthorizationUserId");
                actionContext.Request.Properties.Add("AuthorizationUserId", user.UserId);
                return;
            }

            Throw401Exception(actionContext, "用户登录失败");
        }

        private static bool SkipAuthorization(HttpActionContext actionContext)
        {
            Contract.Assert(actionContext != null);

            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any()
                   || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAnonymousAttribute>().Any();
        }


        private static bool AllowAllUser(HttpActionContext actionContext)
        {
            return actionContext.ActionDescriptor.GetCustomAttributes<AllowAllUserAttribute>().Any()
                  || actionContext.ControllerContext.ControllerDescriptor.GetCustomAttributes<AllowAllUserAttribute>().Any();

        }

        private static void Throw401Exception(HttpActionContext actionContext, string exceptionString)
        {
            var response = HttpContext.Current.Response;

            response.Headers.Add("WWW-Authenticate",
                    string.Format("Basic realm=\"{0}\"", "KMHC.SLTC.APPAPI"));

            throw new HttpResponseException(
           actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, exceptionString ?? "抱歉，用户验证失败，请稍后重试。"));

        }
    }
}