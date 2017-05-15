namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class FunctionModel
    {
        public int FunctionID { get; set; }
        public string FunctionNo { get; set; }
        public string FunctionName { get; set; }
        public string Url { get; set; }
        public string ModuleName { get; set; }
        public int OrderSeq { get; set; }
        public string Description { get; set; }
        public string Remark { get; set; }
        public bool IsIndependent { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public int MenuID { get; set; }
    }
}
