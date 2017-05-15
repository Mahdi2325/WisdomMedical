namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ActivityNewModel
    {
        public int ActivityNewID { get; set; }
        public string GANo { get; set; }
        public string OrgNo { get; set; }
        public string GATitle { get; set; }
        public Nullable<System.DateTime> StartTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public string GAType { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Organizer { get; set; }
        public string Description { get; set; }
        public Nullable<System.DateTime> PStartTime { get; set; }
        public Nullable<System.DateTime> PEndTime { get; set; }
        public string Attachment { get; set; }
        public Nullable<System.DateTime> DelayStartTime { get; set; }
        public Nullable<System.DateTime> DelayEndTime { get; set; }
        public string Status { get; set; }
        public bool IsDelay { get; set; }
        public string Remark { get; set; }
        public string Result { get; set; }
        public string Process { get; set; }
        public string Summary { get; set; }
        public string Evaluation { get; set; }
        public string ResultRemark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
