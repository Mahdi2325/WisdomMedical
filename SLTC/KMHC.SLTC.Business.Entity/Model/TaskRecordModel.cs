using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
   public class TaskRecordModel
    {
        public int ID { get; set; }
        public Nullable<System.DateTime> ServiceTime { get; set; }
        public Nullable<System.DateTime> ChangeTime { get; set; }
        public string Reason { get; set; }
        public Nullable<bool> IsAudit { get; set; }
        public bool IsDeleted { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public Nullable<int> TaskID { get; set; }
    }
}
