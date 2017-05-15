namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class HabitModel
    {
        public int ID { get; set; }
        public string HabitType { get; set; }
        public string Content { get; set; }
        public string Remarks { get; set; }
        public int PersonID { get; set; }
    }
}
