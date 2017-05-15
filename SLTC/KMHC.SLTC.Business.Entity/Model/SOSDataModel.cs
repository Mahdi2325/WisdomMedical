namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class SOSDataModel
    {
        public int ID { get; set; }
        public string IMEI { get; set; }
        public string Phone { get; set; }
        public string Name { get; set; }
        public long EmgDate { get; set; }
        public string Address { get; set; }
        public float Lat { get; set; }
        public float Lng { get; set; }
        public float Hpe { get; set; }
        public string Method { get; set; }      
    }
}
