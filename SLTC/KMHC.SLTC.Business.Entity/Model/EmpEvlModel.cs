namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class EmpEvlModel
    {
        public int EmployeeID { get; set; }
        public string EmpNo { get; set; }
        public string EmpName { get; set; }
        public string PhotoPath { get; set; }
        public DateTime? BirthDate { get; set; }
        public int Age { get; set; }
        public string Sex { get; set; }
        public float Mark { get; set; }
        public int EvlCount { get; set; }
        public int SerCount { get; set; }
    }
}
