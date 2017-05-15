using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.WebUI.Models
{
    public class UserModel
    {
        public string Id { get; set; }
        public string UserNo { get; set; }
        public string UserName { get; set; }

        public string Account { get; set; }

        public string Password { get; set; }

        public bool Status { get; set; }

        public List<string> Roles { get; set; }

        public string DefaultPage { get; set; }
    }
}