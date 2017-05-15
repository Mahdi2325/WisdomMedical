namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class DeptModel
    {
        public int DeptID { get; set; }
        public string DeptNo { get; set; }
        public string DeptName { get; set; }
        public string CommunityLocation { get; set; }
        public Nullable<int> OrganizationID { get; set; }
        public Nullable<int> Status { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public Nullable<bool> IsDeleted { get; set; }
    }
}
