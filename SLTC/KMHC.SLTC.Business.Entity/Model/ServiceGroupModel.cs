namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ServiceGroupModel
    {
        public int ServiceGroupID { get; set; }
        public int OrganizationID { get; set; }
        public string SGNo { get; set; }
        public string SGName { get; set; }
        public string Status { get; set; }
        public decimal SumPrice { get; set; }
        public string Remark { get; set; }
        public string Description { get; set; }
        public int? Hot { get; set; }
        public int? OrderNum { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public decimal? InitPrice { get; set; }
        public decimal? Discount { get; set; }
        public int? ExpiryDate { get; set; }
        public string ExpiryUnit { get; set; }
        public string Photo { get; set; }
        public List<ServiceItemModel> GroupItems { get; set; }
    }
}
