using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.WebUI.Model.External.HealthRecord
{
    public class ExamineResult
    {
        public int ResultId { get; set; }

        public Nullable<int> ExamId { get; set; }

        /// <summary>
        /// 项目
        /// </summary>
        public Nullable<int> ItemId { get; set; }


        public string ItemCode { get; set; }
        public string Name { get; set; }
        /// <summary>
        /// 结果
        /// </summary>
        public string Result { get; set; }
        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreateBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdateBy { get; set; }
        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }
    }
}
