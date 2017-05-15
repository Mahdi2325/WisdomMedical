using KM.Common;
using Newtonsoft.Json;
using System;
using System.Web;
using System.Web.Security;

namespace KMHC.Infrastructure.Security.Providers
{
    public class FormsAuthenticationService : IAuthenticationService
    {
        private ICustomPrincipal _signedInUser;
        private bool _isAuthenticated;

        public FormsAuthenticationService()
        {
            ExpirationTimeSpan = TimeSpan.FromDays(30);
        }

        public TimeSpan ExpirationTimeSpan { get; set; }

        public void SignIn(ClientUserData clientUserData, bool createPersistentCookie)
        {
            var now = DateTime.Now.ToLocalTime();
            string userData = JsonConvert.SerializeObject(clientUserData);

            var ticket = new FormsAuthenticationTicket(
                1 /*version*/,
                clientUserData.UserId.ToString(),
                now,
                now.Add(ExpirationTimeSpan),
                createPersistentCookie,
                userData,
                FormsAuthentication.FormsCookiePath);

            var encryptedTicket = FormsAuthentication.Encrypt(ticket);

            var cookie = new HttpCookie(FormsAuthentication.FormsCookieName, encryptedTicket)
            {
                HttpOnly = true,
                Secure = FormsAuthentication.RequireSSL,
                Path = FormsAuthentication.FormsCookiePath
            };

            var httpContext = HttpContext.Current;

            if (FormsAuthentication.CookieDomain != null)
            {
                cookie.Domain = FormsAuthentication.CookieDomain;
            }

            if (createPersistentCookie)
            {
                cookie.Expires = ticket.Expiration;
            }

            httpContext.Response.Cookies.Add(cookie);

            _isAuthenticated = true;
            ICustomPrincipal user = new ICustomPrincipal(clientUserData);
            _signedInUser = user;
            httpContext.User = user;
        }

        public void SignOut()
        {
            _signedInUser = null;
            _isAuthenticated = false;
            FormsAuthentication.SignOut();
        }

        public void SetAuthenticatedUserForRequest(ICustomPrincipal user)
        {
            _signedInUser = user;
            _isAuthenticated = true;
        }

        public ICustomPrincipal GetAuthenticatedUser()
        {
            if (_signedInUser != null || _isAuthenticated)
                return _signedInUser;

            var httpContext = HttpContext.Current;
            if (httpContext == null || !httpContext.Request.IsAuthenticated || !(httpContext.User.Identity is FormsIdentity))
            {
                return null;
            }

            var formsIdentity = (FormsIdentity)httpContext.User.Identity;
            var userData = formsIdentity.Ticket.UserData;
            int userId;
            if (!int.TryParse(userData, out userId))
            {
                LogHelper.WriteFatal("User id not a parsable integer");
                return null;
            }

            _isAuthenticated = true;
            return _signedInUser = null;
        }

        public bool IsAuthenticated
        {
            get { return _isAuthenticated; }
        }
    }
}
