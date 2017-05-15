using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Principal;
using System.Text;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace KMHC.SLTC.WebUI.Controllers
{
    public class AntiForgeryAuthorizationdAttribute : AuthorizeAttribute
    {
        public AntiForgeryAuthorizationdAttribute()
        {
        }

        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            if (httpContext == null)
            {
                throw new ArgumentNullException("httpContext");
            }
            var user = httpContext.User;
            if (!user.Identity.IsAuthenticated)
            {
                return false;
            }

            if (!DetermineAccessAllow(httpContext))
            {
                return false;
            }

            return base.AuthorizeCore(httpContext);
        }

        /// <summary>
        /// Determine current request if can access the action.
        /// </summary>
        /// <param name="httpContext"></param>
        /// <returns></returns>
        private bool DetermineAccessAllow(HttpContextBase httpContext)
        {
            return true;
            //bool bCan = false;
            //IHCustomPrincipal user = (IHCustomPrincipal)httpContext.User;
            //if (user.roles.Length > 0)
            //{
            //    foreach (string r in user.roles)
            //    {
            //        int roleId = -1;
            //        bool b = int.TryParse(r, out roleId);
            //        if (b)
            //        {
            //            RolePrivilegeDTO role = service.GetByRole(roleId);
            //            AllowedController foundCtrl = role.Controllers.Where(c => c.ControllerName.ToLower().Equals(_type.FullName.ToLower())).FirstOrDefault();
            //            if (foundCtrl != null)
            //            {
            //                bool bExistAct = foundCtrl.ActionNames.Exists(a => a.ToLower().Equals(_actionDescriptor.ActionName));
            //                bCan = true;
            //                break;
            //            }
            //            else
            //            {
            //                break;
            //            }
            //        }
            //    }
            //}

            //return bCan;
        }

        protected override void HandleUnauthorizedRequest(AuthorizationContext filterContext)
        {
            //string sLoginUrl = "/Home/login";

            //filterContext.Result = new RedirectResult(sLoginUrl);

            //base.HandleUnauthorizedRequest(filterContext);

            filterContext.Result = new RedirectToRouteResult(
                new RouteValueDictionary {
                    { "action", "login" },
                    { "controller", "Home" },
                    { "ReturnUrl", HttpUtility.UrlEncode(filterContext.HttpContext.Request.Url.PathAndQuery,Encoding.UTF8) }
                }
               
            );
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            base.OnAuthorization(filterContext);
        }
    }
}