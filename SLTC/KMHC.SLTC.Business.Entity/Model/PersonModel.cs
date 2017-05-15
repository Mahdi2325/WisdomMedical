namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class PersonModel
    {
        public int PersonID { get; set; }
        public int ResidentID { get; set; }
        public int OrganizationID { get; set; }
        public string PersonNo { get; set; }
        public string Name { get; set; }
        public string Pinyin { get; set; }
        public string Sex { get; set; }
        public string Nationality { get; set; }
        public string IdCard { get; set; }
        public Nullable<System.DateTime> Birthdate { get; set; }
        public string PhotoPath { get; set; }
        public string CensusCity { get; set; }
        public string CensusAddressName { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string HouseNumber { get; set; }
        public Nullable<float> Lng { get; set; }
        public Nullable<float> Lat { get; set; }
        public string Phone { get; set; }
        public string AuditState { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public string MaritalStatus { get; set; }
        public string EducationLevel { get; set; }
        public string LivingStatus { get; set; }
        public string Faith { get; set; }
        public string Tel { get; set; }
        public string Description { get; set; }
        public string QrPath { get; set; }
        public string ResidentType { get; set; }
    }
}
