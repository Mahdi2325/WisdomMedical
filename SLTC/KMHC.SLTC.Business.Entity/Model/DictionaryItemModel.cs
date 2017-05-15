namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class DictionaryItemModel
    {
        public int DictionaryItemID { get; set; }
        public Nullable<int> DictionaryID { get; set; }
        public string ItemCode { get; set; }
        public string ItemName { get; set; }
        public Nullable<int> OrderSeq { get; set; }
        public string Description { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public string ItemType { get; set; }
    }
}
