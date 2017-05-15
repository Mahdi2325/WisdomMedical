namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class PNCModel
    {
        public int PNCID { get; set; }
        public string PNCNo { get; set; }
        public string PNCName { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public int AppCount { get; set; }
    }
}
