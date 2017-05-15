using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class PerformanceModel
    {
       public IList<TaskModel> taskList { get; set; }
       public int completedTaskNum { get; set; }
       public decimal? completedTaskAmount { get; set; }
    }
}
