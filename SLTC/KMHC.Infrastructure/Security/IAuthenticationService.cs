using System;
using System.Web;

namespace KMHC.Infrastructure.Security
{
    public interface IAuthenticationService
    {
        void SignIn(ClientUserData user, bool createPersistentCookie);
        void SignOut();
        void SetAuthenticatedUserForRequest(ICustomPrincipal user);
        ICustomPrincipal GetAuthenticatedUser();
        bool IsAuthenticated { get; }
    }
}
