namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class EmpPlanModel
    {
        public bool IsFullBook { get; set; }
        public string BookDate { get; set; }
        public List<EmpPlanDateModel> EmpPlanDateList { get; set; }
    }

    public partial class EmpPlanDateModel
    {
        public string TimeStart { get; set; }
        public string TimeEnd { get; set; }
        public bool IsFullBook { get; set; }
    }
}
