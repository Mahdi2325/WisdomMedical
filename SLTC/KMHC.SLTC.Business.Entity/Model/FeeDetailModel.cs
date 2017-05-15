namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class FeeDetailModel
    {
        public int FeeDetailID { get; set; }
        public int ResidentID { get; set; }
        public Nullable<int> ServiceOrderID { get; set; }
        public Nullable<int> BillID { get; set; }
        public string FeeNo { get; set; }
        public string FeeName { get; set; }
        public Nullable<decimal> TotalPrice { get; set; }
        public System.DateTime FeeDate { get; set; }
        public string Payment { get; set; }
        public bool IsPay { get; set; }
        public bool IsProduceBill { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
