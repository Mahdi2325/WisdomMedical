namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class GroupModel
    {
        public int GroupID { get; set; }
        public string GroupNo { get; set; }
        public string GroupName { get; set; }
        public string Tel { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
