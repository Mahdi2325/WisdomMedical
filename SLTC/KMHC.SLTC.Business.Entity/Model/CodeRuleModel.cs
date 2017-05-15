namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class CodeRuleModel
    {
        public int CodeRuleID { get; set; }
        public Nullable<int> OrganizationID { get; set; }
        public string CodeKey { get; set; }
        public string FlagRule { get; set; }
        public string GenerateRule { get; set; }
        public string Flag { get; set; }
        public int SerialNumber { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
