using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.FinancialManagement
{
    public partial class ServiceOrderChargeDtlModel
    {
        public int ServiceOrderChergeDtlD { get; set; }
        public string ServiceOrderChargeRecId { get; set; }
        public Nullable<int> ResidentServicePlanItemID { get; set; }
        public int ServiceOrderID { get; set; }
        public int ServiceItemID { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Qty { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal SumPrice { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }

        public int PNCID { get; set; }
        public string PNCName { get; set; }
        public string SONo { get; set; }
        public string SINo { get; set; }
        public string SIName { get; set; }
        public string UnitsName { get; set; }

        public Nullable<int> Operator { get; set; }
        public string OperatorName { get; set; }
        public string Payer { get; set; }
        public string PaymentType { get; set; }
        public Nullable<System.DateTime> PayTime { get; set; }
        public string InvoiceNo { get; set; }
        public string RefundReason { get; set; }
        public Nullable<decimal> ReceiveAmount { get; set; }
    }
}
