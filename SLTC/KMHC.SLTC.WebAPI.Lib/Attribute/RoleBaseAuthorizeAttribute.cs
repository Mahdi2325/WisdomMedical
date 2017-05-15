using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Http;
using System.Web.Routing;

namespace KMHC.SLTC.WebAPI.Lib.Attribute
{
    public class RoleBaseAuthorizeAttribute : AuthorizeAttribute
    {
        //public override void OnAuthorization(System.Web.Http.Controllers.HttpActionContext actionContext)
        //{
        //    if (!SecurityHelper.IsAuthenticated)
        //    {
        //        base.OnAuthorization(actionContext);
        //    }
        //}

        protected override bool IsAuthorized(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            return SecurityHelper.IsAuthenticated;
        }

        protected override void HandleUnauthorizedRequest(System.Web.Http.Controllers.HttpActionContext actionContext)
        {
            actionContext.Response = new HttpResponseMessage(HttpStatusCode.OK);
            actionContext.Response.Content = new StringContent("{ \"ResultMessage\": \"没有权限访问\", \"ResultCode\": " + (int)EnumApiResponseStatus.Unauthorized + " }",
                Encoding.GetEncoding("UTF-8"), "application/json");
            //actionContext.Response.Content =
            //if (!actionContext.Controller.User.Identity.IsAuthenticated)
            //{
            //    if (filterContext.HttpContext.Request.IsAjaxRequest())
            //    {
            //        filterContext.Result = new JsonResult
            //        {
            //            Data = new { Message = "Your session has died a terrible and gruesome death" },
            //            JsonRequestBehavior = JsonRequestBehavior.AllowGet
            //        };
            //        filterContext.HttpContext.Response.StatusCode = 401;
            //        filterContext.HttpContext.Response.StatusDescription = "Humans and robots must authenticate";
            //        filterContext.HttpContext.Response.SuppressFormsAuthenticationRedirect = true;
            //    }
            //}
            //base.HandleUnauthorizedRequest(actionContext);
        }
    }
}