using KMHC.Infrastructure.Security;
using System.Web;

namespace KMHC.Infrastructure
{
    public class SecurityHelper
    {
        public static ICustomPrincipal CurrentPrincipal
        {
            get
            {
                return HttpContext.Current.User as ICustomPrincipal;
            }
        }

        public static bool IsAuthenticated
        {
            get
            {
                return CurrentPrincipal != null && CurrentPrincipal.Identity.IsAuthenticated;
            }
        }
    }
}
