namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ResidentModel
    {
        public int ResidentID { get; set; }
        public int OrganizationID { get; set; }
        public String OrgName { get; set; }
        public int PersonID { get; set; }
        public string Nationality { get; set; }
        public string NationalityName { get; set; }
        public string ResidentNo { get; set; }
        public int AreaID { get; set; }
        public string Status { get; set; }
        public string Contract { get; set; }
        public string Carer { get; set; }
        public System.DateTime CheckInDate { get; set; }
        public string Operator { get; set; }
        public string Sex { get; set; }
        public string ResidentType { get; set; }
        public string HealthData { get; set; }
        public string SStartDate { get; set; }
        public string SLifecycle { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public string PersonName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string HouseNumber { get; set; }
        public string IdCard { get; set; }
        public Nullable<System.DateTime> Birthdate { get; set; }
        public string PhotoPath { get; set; }
        public string PersonNo { get; set; }
        public string Phone { get; set; }
        public string AreaName { get; set; }
        public string CensusAddressName { get; set; }
        public float? Lng { get; set; }
        public float? Lat { get; set; }
        public decimal RemainingMoney { get; set; }
        public string QrPath { get; set; }
    }
}
