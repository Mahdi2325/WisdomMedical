namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class DictionaryModel
    {
        public int DictionaryID { get; set; }
        public string ItemType { get; set; }
        public string TypeName { get; set; }
        public string ModifyFlag { get; set; }
        public string Description { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public List<DictionaryItemModel> Items { get; set; }
    }
}
