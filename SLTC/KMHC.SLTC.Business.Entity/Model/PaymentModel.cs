namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class PaymentModel
    {
        public int PaymentID { get; set; }

        public Nullable<int> ResidentID { get; set; }
        public Nullable<int> BillID { get; set; }
        public string PaymentNo { get; set; }
        public decimal Amount { get; set; }
        public string PayMethod { get; set; }
        public Nullable<System.DateTime> PayDate { get; set; }
        public string Payee { get; set; }
        public string InvoiceNo { get; set; }
        public string PayType { get; set; }

        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
