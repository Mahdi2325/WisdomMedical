namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ServiceItemModel
    {
        public int ServiceItemID { get; set; }
        public int OrganizationID { get; set; }
        public int ServiceItemCategoryID { get; set; }
        public string SINo { get; set; }
        public string SIName { get; set; }
        public string SIType { get; set; }
        public string Remark { get; set; }        
        public string PhotoPath { get; set; }
        public string Keywords { get; set; }
        public Nullable<int> Hot { get; set; }
        public Nullable<int> OrderNum { get; set; }
        public string Description { get; set; }
        public string OrderMode { get; set; }
        public float? Unit { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public List<ChargeItemModel> ChargeItems { get; set; }
        public decimal SumPrice { get; set; }
        public int? ServiceTimes { get; set; }
        public int? RestTimes { get; set; }
        public int? ResidentServicePlanItemID { get; set; }
        public int? Priorit { get; set; }
    }
}
