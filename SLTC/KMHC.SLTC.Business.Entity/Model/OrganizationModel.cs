namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class OrganizationModel
    {
        public int OrganizationID { get; set; }
        public Nullable<int> GroupID { get; set; }
        public string GroupName { get; set; }
        public string OrgNo { get; set; }
        public string OrgName { get; set; }
        public string OrgType { get; set; }
        public string Contact { get; set; }
        public string Tel { get; set; }
        public string Fax { get; set; }
        public string Email { get; set; }
        public string WebSite { get; set; }
        public string BillSettings { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string HouseNumber { get; set; }
        public float? Lng { get; set; }
        public float? Lat { get; set; }
        public string LogoPath { get; set; }
        public int? CreatedBy { get; set; }
        public System.DateTime? CreatedTime { get; set; }
        public int? ModifiedBy { get; set; }
        public System.DateTime? ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
    }
}
