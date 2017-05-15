namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class DeviceModel
    {
        public int ID { get; set; }
        public string DeviceType { get; set; }
        public string DeviceName { get; set; }
        public string DeviceNo { get; set; }
        public int PersonID { get; set; }
    }
}
