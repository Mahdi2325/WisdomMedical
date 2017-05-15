namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ContractModel
    {
        public int ID { get; set; }
        public string ContractNo { get; set; }
        public decimal? ContractValue { get; set; }
        public string DiscountInfo { get; set; }
        public decimal? FinalValue { get; set; }
        public System.DateTime? StartTime { get; set; }
        public System.DateTime? EndTime { get; set; }
        public string ServiceType { get; set; }
        public string ContractForm { get; set; }
        public string CaseNature { get; set; }
        public string Description { get; set; }
        public string ContractFile { get; set; }
        public int ReservedOperator { get; set; }
        public int PersonID { get; set; }
        public string PersonName { get; set; }
        public int? CreatedBy { get; set; }
        public System.DateTime? CreatedTime { get; set; }
        public int? ModifiedBy { get; set; }
        public System.DateTime? ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
