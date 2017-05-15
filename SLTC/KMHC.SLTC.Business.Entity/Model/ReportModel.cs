namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public class ReportModel
    {
        public int ID { get; set; }
        public string CODE { get; set; }
        public string NAME { get; set; }
        public string MAJORTYPE { get; set; }
        public string REPORTTYPE { get; set; }
        public string FilterType { get; set; }
        public Nullable<bool> IsFeeNoRequired { get; set; }
        public string SYSTYPE { get; set; }
        public Nullable<bool> STATUS { get; set; }
        public string ORGID { get; set; }
    }
}
