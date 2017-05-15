using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.Sequence
{
    public class PatientQueueModel
    {
        public int QueueID { get; set; }
        public int ServiceItemID { get; set; }
        public string SIName { get; set; }
        public int EmployeeID { get; set; }
        public string EmpName { get; set; }
        public int ResidentID { get; set; }
        public string ResidentName { get; set; }
        public string SerialNumber { get; set; }
        public int CheckNumber { get; set; }
        public int CheckStatus { get; set; }
        public Nullable<System.DateTime> CheckBeginTime { get; set; }
        public int CheckRoomQueueRecID { get; set; }
        public Nullable<int> OrganizationID { get; set; }

        public int DeptID { get; set; }

        public int CheckRoomID { get; set; }

        public string CheckRoomName { get; set; }
        public string DeptName { get; set; }

    }
}
