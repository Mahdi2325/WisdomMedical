namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ServiceOrderModel
    {
        public int ServiceOrderID { get; set; }
        public int ResidentID { get; set; }
        public int OrganizationID { get; set; }
        public int ServiceItemID { get; set; }
        public string SIName { get; set; }
        public string SONo { get; set; }
        public Nullable<int> ServiceType { get; set; }
        public string OrderTitle { get; set; }
        public string Priority { get; set; }
        public System.DateTime Otime { get; set; }
        public int? PNCID { get; set; }
        public int Quantity { get; set; }
        public decimal InitPrice { get; set; }
        public decimal ServicePrice { get; set; }
        public decimal Discount { get; set; }
        public decimal Price { get; set; }
        public string Remark { get; set; }
        public string OrderStatus { get; set; }
        public string PaymentStatus { get; set; }
        public string ServiceAddress { get; set; }
        public float? Lng { get; set; }
        public float? Lat { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string Payment { get; set; }
        public string Delivery { get; set; }
        public string OrderType { get; set; }
        public string OrderFrom { get; set; }
        public int? SelEmployeeID { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public int? ResidentServicePlanItemID { get; set; }
        public bool IsCancelFlag { get; set; }
        public Nullable<int> OrderCreator { get; set; }
        public string ResidentNo { get; set; }
        public List<CommodityItemModel> CommodityItems { get; set; }
        public List<SerOrdSerItModel> ServiceItems { get; set; }
        public string Sex { get; set; }
        public string PersonName { get; set; }
        public string TaskStatus { get; set; }
        public bool IsRefund { get; set; }
        public bool IsNeedAuditRefund { get; set; }
        public bool IsEva { get; set; }
        public float? Unit { get; set; }
        public int? ServiceAppID { get; set; }
        public string OrderMode { get; set; }
    }
}
