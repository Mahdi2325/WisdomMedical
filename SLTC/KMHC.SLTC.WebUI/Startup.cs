using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(KMHC.SLTC.WebUI.Startup))]
namespace KMHC.SLTC.WebUI
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
           // ConfigureAuth(app);
            app.MapSignalR();
        }
    }
}
