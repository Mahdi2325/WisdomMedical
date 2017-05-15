using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.Business.Entity.Filter
{
    public class ReportFilter
    {
        public string Code { get; set; }
        public string Name { get; set; }
        public string MajorType { get; set; }
        public string ReportType { get; set; }
        public string SysType { get; set; }
        public bool? Status { get; set; }
        public string OrgId { get; set; }
    }
    
}





