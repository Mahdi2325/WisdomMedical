namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class RoleModel
    {
        public int RoleID { get; set; }
        public string RoleNo { get; set; }
        public string RoleName { get; set; }
        public string Description { get; set; }
        public string DefaultPage { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }

        public List<MenuModel> MenuItems { get; set; }
    }
}
