namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class DepositModel
    {
        public int DepositID { get; set; }
        public Nullable<int> ResidentID { get; set; }
        public string DepositNo { get; set; }
        public decimal Amount { get; set; }
        public Nullable<System.DateTime> DepositDate { get; set; }
        public decimal TotalConSpeMonth { get; set; }
        public string Payee { get; set; }
        public string PayMethod { get; set; }
        public string InvoiceNo { get; set; }

        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }

        public int OrganizationID { get; set; }
    }
}
