namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ServiceAppointmentModel
    {
        public int ServiceAppID { get; set; }
        public Nullable<int> ResidentID { get; set; }
        public Nullable<System.DateTime> ServiceDate { get; set; }
        public Nullable<int> PNCID { get; set; }
        public Nullable<int> ServiceType { get; set; }
        public string ServiceItemType { get; set; }
        public string AppBy { get; set; }
        public Nullable<System.DateTime> AppTime { get; set; }
        public string AppPhone { get; set; }
        public string Relation { get; set; }
        public string Introducer { get; set; }
        public string IntroducerPhone { get; set; }
        public string Status { get; set; }
        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public string PersonName { get; set; }
        public string PNC { get; set; }

        public List<SerAppSerItModel> ServiceItems { get; set; }
    }
}
