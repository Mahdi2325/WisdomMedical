namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class CallInfoModel
    {
        public int ID { get; set; }
        public int PersonID { get; set; }
        public System.DateTime? CallDate { get; set; }
        public string CallCatagory { get; set; }
        public string CallType { get; set; }
        public string ReferralOrg { get; set; }
        public string Status { get; set; }
        public string Result { get; set; }
    }
}
