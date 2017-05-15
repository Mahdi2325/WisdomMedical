namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ResidentInfoModel
    {
        public int? CallNum { get; set; }
        public int? OrderNumber { get; set; }
        public decimal? ServiceAmount { get; set; }
        public decimal? Amount { get; set; }
        public decimal? TotalConSpeMonth { get; set; }
    }
}
