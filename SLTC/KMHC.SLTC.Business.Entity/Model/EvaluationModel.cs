namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class EvaluationModel
    {
        public int ID { get; set; }
        public int EmployeeID { get; set; }
        public int ServiceOrderID { get; set; }
        public float? Mark { get; set; }
        public string Content { get; set; }
        public Nullable<int> CreateBy { get; set; }
        public string CreateByName { get; set; }
        public Nullable<System.DateTime> CreateTime { get; set; }
    }
}
