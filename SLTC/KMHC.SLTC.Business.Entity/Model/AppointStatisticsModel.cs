using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.Sequence
{
    public class ServiceAppointment 
    {
        public int ServiceAppID { get; set; }
        public int? ResidentID { get; set; }
        public DateTime? ServiceDate { get; set; }
        public int? PNCID { get; set; }
        public int? ServiceType { get; set; }
        public string ServiceItemType { get; set; }
        public string AppBy { get; set; }
        public DateTime? AppTime { get; set; }
        public string AppPhone { get; set; }
        public string Relation { get; set; }
        public string Introducer { get; set; }
        public string IntroducerPhone { get; set; }
        public string Status { get; set; }
        public string Remark { get; set; }
        public  int? CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public Nullable<bool> IsDeleted { get; set; }

    }

    public class AppointStatistics
    {
        public List<ServiceAppointment> ServicePeople { get; set; }  
    
    }
}
