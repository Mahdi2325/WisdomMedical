namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ResidentServicePlanItemModel
    {
        public int ResidentServicePlanItemID { get; set; }
        public int ResidentServicePlanID { get; set; }
        public int ServiceItemID { get; set; }
        public string SINo { get; set; }
        public string SIName { get; set; }
        public string SIType { get; set; }
        public string Remark { get; set; }
        public int ServiceTimes { get; set; }
        public int RestTimes { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
