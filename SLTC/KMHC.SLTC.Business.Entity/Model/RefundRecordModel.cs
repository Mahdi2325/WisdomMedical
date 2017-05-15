using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class RefundRecordModel
    {
        public int ID { get; set; }
        public int ServiceOrderID { get; set; }
        public string Reason { get; set; }
        public decimal Fund { get; set; }
        public string Status { get; set; }
        public string Reply { get; set; }
        public int CreateBy { get; set; }
        public System.DateTime CreateTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
    }
}
