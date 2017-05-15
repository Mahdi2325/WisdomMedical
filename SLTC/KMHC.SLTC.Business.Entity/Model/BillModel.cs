namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class BillModel
    {
        public int BillID { get; set; }
        public int ResidentID { get; set; }
        public string BillNo { get; set; }
        public decimal TotalCpAmount { get; set; }
        public decimal TotalPayAmount { get; set; }
        public decimal TotalDiscountAmount { get; set; }
        public decimal TotalNeedAmount { get; set; }
        public string BillContent { get; set; }
        public System.DateTime BillDate { get; set; }
        public string BillStatus { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }

        public int OrganizationID { get; set; }

    }
}
