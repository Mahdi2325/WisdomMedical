using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.Home
{
    public class TodayInfoModel
    {
        public int ResidentNumber { get; set; }
        public int OrderNumber { get; set; }

        public int TaskNubmer { get; set; }

        public Decimal? OrderAmount { get; set; }

    }
}
