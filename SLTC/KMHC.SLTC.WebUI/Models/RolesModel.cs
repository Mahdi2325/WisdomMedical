using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.WebUI.Models
{
    public class RolesModel
    {
        public string Id { get; set; }
        public string RoleNo { get; set; }

        public string RoleName { get; set; }

        public bool Status { get; set; }

        public string Remark { get; set; }

        public string DefaultPage { get; set; }

    }
}