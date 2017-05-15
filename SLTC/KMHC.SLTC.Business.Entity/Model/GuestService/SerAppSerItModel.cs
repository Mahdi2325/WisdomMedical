namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class SerAppSerItModel
    {
        public int ServiceAppSIID { get; set; }
        public int ServiceAppID { get; set; }
        public int ServiceItemID { get; set; }
        public string SINo { get; set; }
        public string SIName { get; set; }
        public string SIType { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Qty { get; set; }
        public decimal SumPrice { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
        public int? Priorit { get; set; }
        public int? OrderNum { get; set; }
    }
}
