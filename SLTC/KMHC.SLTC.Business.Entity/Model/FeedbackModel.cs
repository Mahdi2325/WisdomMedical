using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
   public class FeedbackModel
    {
        public int ID { get; set; }
        public int userID { get; set; }
        public Nullable<System.DateTime> feedBackTime { get; set; }
        public string feedBackContent { get; set; }
    }
}
