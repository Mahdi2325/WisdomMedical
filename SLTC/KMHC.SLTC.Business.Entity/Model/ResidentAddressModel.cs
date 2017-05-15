namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class ResidentAddressModel
    {
        public int AddressID { get; set; }
        public int ResidentID { get; set; }
        public string City { get; set; }
        public string Address { get; set; }
        public string HouseNumber { get; set; }
        public string Name { get; set; }
        public string Phone { get; set; }
        public Nullable<float> Lng { get; set; }
        public Nullable<float> Lat { get; set; }
        public Nullable<bool> IsUsed { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
    }
}
