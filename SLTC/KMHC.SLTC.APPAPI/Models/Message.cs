using KMHC.Infrastructure.Security;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.APPAPI.Models
{
    public class Message
    {
        public string status { get; set; }
        public string detail { get; set; }
        public dynamic content { get; set; }
    }
}