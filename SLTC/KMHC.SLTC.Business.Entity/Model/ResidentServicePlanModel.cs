namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ResidentServicePlanModel
    {
        public int ResidentServicePlanID { get; set; }
        public int ResidentID { get; set; }
        public int ServiceGroupID { get; set; }
        public string SGNo { get; set; }
        public string SGName { get; set; }
        public decimal SumPrice { get; set; }
        public string Remark { get; set; }
        public string Description { get; set; }
        public System.DateTime SStartDate { get; set; }
        public System.DateTime? SEndDate { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }

        public List<ResidentServicePlanItemModel> GroupItems { get; set; } 
    }
}
