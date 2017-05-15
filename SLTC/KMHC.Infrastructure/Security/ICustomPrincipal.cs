using System;
using System.Security.Principal;
using System.Web;
using System.Linq;
using AutoMapper;

namespace KMHC.Infrastructure.Security
{
    public class ICustomPrincipal : ClientUserData, IPrincipal
    {
        public IIdentity Identity { get; private set; }
        public string[] roles { get; set; }

        public ICustomPrincipal(ClientUserData clientUserData)
        {
            this.Identity = new GenericIdentity(string.Format("{0}_{1}", clientUserData.UserId, clientUserData.EmpName));
            Mapper.DynamicMap(clientUserData, this);
        }

        public bool IsInRole(string role)
        {
            if (roles.Any(r => role.Contains(r)))
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    }
}
