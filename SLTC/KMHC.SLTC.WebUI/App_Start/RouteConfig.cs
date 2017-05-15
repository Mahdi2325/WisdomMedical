using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace KMHC.SLTC.WebUI
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");
            routes.IgnoreRoute("*.html");

            routes.MapRoute(
              name: "Application",
              url: "angular/{*url}",
              defaults: new { controller = "Home", action = "Index" });

            routes.MapRoute(
              name: "ReportApplication",
              url: "Report/{*url}",
              defaults: new { controller = "Home", action = "Report" });

            routes.MapRoute(
              name: "WapApplication",
              url: "wap/{*url}",
              defaults: new { controller = "Home", action = "WapIndex" });

            routes.MapRoute(
            name: "AppDc",
            url: "dc/{*url}",
            defaults: new { controller = "Home", action = "DCIndex" });

            routes.MapRoute(
                name: "Default",
                url: "{controller}/{action}/{id}",
                defaults: new { controller = "Home", action = "Login", id = UrlParameter.Optional }
            );
        }
    }
}
