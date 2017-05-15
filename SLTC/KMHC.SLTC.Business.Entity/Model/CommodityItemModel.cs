namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class CommodityItemModel
    {
        public int CommodityItemID { get; set; }
        public int OrganizationID { get; set; }
        public string CINo { get; set; }
        public string CIName { get; set; }
        public string PhotoPath { get; set; }
        public int? CICategory { get; set; }
        public string CICategoryName { get; set; }
        public string Unit { get; set; }
        public int? Quantity { get; set; }
        public decimal Price { get; set; }
        public string Description { get; set; }
        public int? OrderNum { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
