using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class Menu
    {
        public int MenuID { get; set; }
        public int OrderSeq { get; set; }
        public string MenuName { get; set; }
        public IList<FunctionModel> Functions { get; set; }

    }


}
