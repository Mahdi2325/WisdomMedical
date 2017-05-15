using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.Sequence
{
    public class PatientCollection
    {
        public IList<PatientQueueModel> InQueuePatientList { get; set; }
        public IList<PatientQueueModel> InServicingPatientList { get; set; }

        public IList<PatientQueueModel> InExpiredPatientList { get; set; }

    }
}
