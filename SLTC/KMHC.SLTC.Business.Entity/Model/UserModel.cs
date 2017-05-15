namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class UserModel
    {
        public int UserID { get; set; }
        public string AccountName { get; set; }
        public string Password { get; set; }
        public string DisplayName { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public string OrganizationName { get; set; }
        public string GroupName { get; set; }
        public int OrganizationID { get; set; }
        public int GroupID { get; set; }
        public RoleModel Role { get; set; }
        public int RoleId { get; set; }
        public EmployeeModel Employee { get; set; }
    }
}
