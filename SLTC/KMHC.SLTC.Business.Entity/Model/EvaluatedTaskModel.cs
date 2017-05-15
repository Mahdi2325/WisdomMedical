using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class EvaluatedTaskModel
    {
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }

        public string ServiceName { get; set; }

        public string TaskNO { get; set; }

        public string PersonName { get; set; }

        public float? Mark { get; set; }

        public DateTime? MarkTime { get; set; }
    }
}
