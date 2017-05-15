namespace KMHC.SLTC.Business.Entity.Model
{
    using KMHC.SLTC.Business.Entity.Model.FinancialManagement;
    using System;
    using System.Collections.Generic;
    
    public partial class SerOrdSerItModel
    {
        public int ServiceOrderSIID { get; set; }
        public int ServiceOrderID { get; set; }
        public int ServiceItemID { get; set; }
        public int? ServiceSerialNo { get; set; }
        public int PNCID { get; set; }
        public string PNCName { get; set; }
        public string SINo { get; set; }
        public string SIName { get; set; }
        public string SIType { get; set; }
        public string UnitName { get; set; }
        public decimal UnitPrice { get; set; }
        public decimal Qty { get; set; }
        public decimal DiscountPrice { get; set; }
        public decimal SumPrice { get; set; }
        public Nullable<int> ResidentServicePlanItemID { get; set; }
        public Nullable<int> ChargeStatus { get; set; }
        public Nullable<int> CheckStatus { get; set; }
        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public Nullable<int> Priorit { get; set; }
        public Nullable<int> OrderNum { get; set; }
        public bool IsDeleted { get; set; }

        public string SONo { get; set; }
        public System.DateTime Otime { get; set; }
        public Nullable<int> OrderCreator { get; set; }
        public string EmpName { get; set; }

        public int CheckRoomQueueRecID { get; set; }
    }
    public partial class PaymentsModel
    {
        public int ResidentID { get; set; }
        public decimal ThisTtlAmt { get; set; }
        public string Payer { get; set; }
        public string PaymentType { get; set; }
        public string InvoiceNo { get; set; }
        public decimal CurAmount { get; set; }
        public decimal PreAmount { get; set; }
    }

    public partial class PaymentsServiceOrderModel
    {
        public int ServiceOrderID { get; set; }
        public decimal SumPrice { get; set; }
    }
    public class SerOrdSerItModelList
    {
        public SerOrdSerItModelList()
        {
            SerOrdSerItModelLists = new List<SerOrdSerItModel>();
            PaymentsServiceOrderModelLists = new List<PaymentsServiceOrderModel>();
            PaymentInfos = new PaymentsModel();
            RefundInfos = new RefundModel();
        }

        public List<SerOrdSerItModel> SerOrdSerItModelLists { get; set; }

        public List<PaymentsServiceOrderModel> PaymentsServiceOrderModelLists { get; set; }

        public PaymentsModel PaymentInfos { get; set; }

        public RefundModel RefundInfos { get; set; }
    }


}
