using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity
{

    public class ChartColumnModel
    {
        public ArrayList Name { get; set; }
        public ArrayList Data { get; set; }
    }

    public class ChartMColumnModel
    {

        public ArrayList Name { get; set; }

        public ArrayList AlreadyData { get; set; }

        public ArrayList NoneData { get; set; }

    }

    public class ChartPieModel
    {

        public List<SelectModel> SelectNames { get; set; }
        public List<List<ArrayList>> MyData { get; set; }
    }

    public class DataModel
    {
        public string Name { get; set; }
        public int Data { get; set; }
    }

    public class SelectModel
    {
        public string Name { get; set; }
        public int Value { get; set; }

    }

}
