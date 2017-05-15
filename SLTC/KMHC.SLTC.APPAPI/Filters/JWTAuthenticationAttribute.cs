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
    /// Jwt Token安全验证
    /// </summary>
    public class JWTAuthenticationAttribute : AuthorizeAttribute
    {

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

                Throw401Exception(actionContext, "NoToken");
            }

            string sendToken = authHeader.Value.FirstOrDefault();

            //url获取token
            var exp = Math.Round((DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds + 5);
            try
            {
                var dictPayload = JWT.JsonWebToken.DecodeToObject(sendToken, KMHC.SLTC.Business.Entity.Constants.SecretKey) as IDictionary<string, dynamic>;
                string userid = dictPayload["iss"];
                double jwtcreated = dictPayload["iat"];
                //检查令牌的有效期
                if (exp - jwtcreated > 3600*24)
                {
                    Throw401Exception(actionContext, "TokenTimeout");
                }
                return;
            }
            catch (Exception ex)
            {
                Throw401Exception(actionContext, "InvalidToken");
            }
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
           actionContext.Request.CreateErrorResponse(HttpStatusCode.Unauthorized, exceptionString ?? "Unauthorized"));
        }
    }
}