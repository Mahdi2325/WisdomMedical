namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class FamilyModel
    {
        public int ID { get; set; }
        public string Relation { get; set; }
        public string Name { get; set; }
        public bool? IsEmerg { get; set; }
        public string Tell { get; set; }
        public string Phone { get; set; }
        public bool? HasKey { get; set; }
        public string Location { get; set; }
        public int PersonID { get; set; }
    }
}
