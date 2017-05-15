namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class EmployeeModel
    {
        public int EmployeeID { get; set; }
        public Nullable<int> OrganizationID { get; set; }
        public string EmpNo { get; set; }
        public string EmpName { get; set; }
        public string Nationality { get; set; }
        public string IdCard { get; set; }
        public string Tel { get; set; }
        public string Email { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string HouseNumber { get; set; }
        public float? Lng { get; set; }
        public float? Lat { get; set; }
        public string Sex { get; set; }
        private string birthdate;

        public string Birthdate
        {
            get
            {
                string bd = birthdate;
                if (!string.IsNullOrWhiteSpace(birthdate))
                {
                    bd = Convert.ToDateTime(birthdate).ToString("yyyy-MM-dd");
                }
                return bd;

            }
            set { birthdate = value; }
        }
        public string CensusAddressName { get; set; }
        public string Description { get; set; }
        public string PhotoPath { get; set; }
        public string ECPerson { get; set; }
        public string ECPhone { get; set; }
        public string Position { get; set; }
        public string JobTitle { get; set; }
        public string Qualifications { get; set; }
        public string Zip { get; set; }
        public string MerryFlag { get; set; }
        public string HiredType { get; set; }
        public string EmpState { get; set; }
        public Nullable<int> DeptID { get; set; }
        public Nullable<int> CheckRoomID { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public int CompletedTaskNum { get; set; }
        public decimal? CompletedTaskAmount { get; set; }
    }
}
