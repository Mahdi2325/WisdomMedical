namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ChargeItemModel
    {
        public int ChargeItemID { get; set; }
        public int? ServiceItemID { get; set; }
        public string CIName { get; set; }
        public string Unit { get; set; }
        public int? Quantity { get; set; }
        public decimal? Price { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
