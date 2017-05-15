namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class MonitorResultModel
    {
        public int MonitorResultID { get; set; }
        public string MRNo { get; set; }
        public string PersonNo { get; set; }
        public string MTNo { get; set; }
        public Nullable<System.DateTime> MRDatetime { get; set; }
        public string SourceType { get; set; }
        public string SNO { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
