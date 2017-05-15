namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class AreaModel
    {
        public int AreaID { get; set; }
        public Nullable<int> OrganizationID { get; set; }

        public string OrgName { get; set; }

        public string AreaNo { get; set; }
        public string AreaName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string Description { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
