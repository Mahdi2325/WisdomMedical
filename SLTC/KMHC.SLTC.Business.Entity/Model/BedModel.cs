namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class BedModel
    {
        public int BedID { get; set; }
        public Nullable<int> RoomID { get; set; }
        public string BedNo { get; set; }
        public string Sex { get; set; }
        public string BedName { get; set; }
        public string BedState { get; set; }
        public string BedType { get; set; }
        public string Category { get; set; }
        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
