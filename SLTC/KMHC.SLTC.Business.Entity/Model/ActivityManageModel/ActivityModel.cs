namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ActivityModel
    {
        public int ID { get; set; }
        public int CategoryID { get; set; }
        public string CategoryName { get; set; }
        public int? ItemID { get; set; }
        public string ItemName { get; set; }
        public string ActivityName { get; set; }
        public string ActivityContent { get; set; }
        public string ActivityPlace { get; set; }
        public System.DateTime? StartTime { get; set; }
        public decimal? Hours { get; set; }
        public System.DateTime? EndTime { get; set; }
        public string EmployeeIDs { get; set; }
        public string EmployeeNames { get; set; }
        public int EmployeeCount { get; set; }
        public string MemberIDs { get; set; }
        public string MemberNames { get; set; }
        public int MemberCount { get; set; }
        public string OtherPersons { get; set; }
        public int OtherCount { get; set; }
        public int AreaID { get; set; }
        public string AreaName { get; set; }
        public int OrganizationID { get; set; }
        public int? CreateFromID { get; set; }
    }
}
