using KMHC.SLTC.APPAPI.Filters;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI
{
    public static class WebApiConfig
    {
        public static void Register(HttpConfiguration config)
        {
            // Web API 配置和服务

            // Web API 路由
            config.MapHttpAttributeRoutes();
          //  config.Filters.Add(new BasicAuthenticationAttribute());
            config.Routes.MapHttpRoute(
                name: "DefaultApi",
                routeTemplate: "api/{controller}/{id}",
                defaults: new { id = RouteParameter.Optional }
            );
        }
    }
}
