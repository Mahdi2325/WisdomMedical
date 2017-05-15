/*
 * 描述:体检记录
 *  
 * 修订历史: 
 * 日期       修改人              Email                  内容
 * 20151015   郝元彦              haoyuanyan@gmail.com   创建 
 *  
 */

using System;

namespace KMHC.SLTC.WebUI.Model.External.HealthRecord
{
    public class ExamineRecord
    {
        public int ExamId { get; set; }

        public int? PersonId { get; set; }
        public string ExamNo { get; set; }

        /// <summary>
        /// 检查日期 包括年检日期，随访日期等等
        /// </summary>
        public DateTime? ExamDate { get; set; }

        /// <summary>
        /// 检查类型，年检，随访，量测，一体机上传等等
        /// todo 定义检查类型字典
        /// </summary>
        public string ExamType { get; set; }

        /// <summary>
        /// 随访方式 WS364.12 CV06.00.207
        /// </summary>
        public string VisitWay { get; set; }


        /// <summary>
        /// 随访医生姓名
        /// </summary>
        public string Doctor { get; set; }

        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreateBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdateBy { get; set; }
        public Nullable<byte> Status { get; set; }

    }

    public class LastExamineRecord
    {
        public int ExamId { get; set; }
        public string Name { get; set; }
        public string IDNumber { get; set; }
        public int? PersonId { get; set; }
        public string ExamNo { get; set; }

        /// <summary>
        /// 检查日期 包括年检日期，随访日期等等
        /// </summary>
        public DateTime? ExamDate { get; set; }

        /// <summary>
        /// 检查类型，年检，随访，量测，一体机上传等等
        /// todo 定义检查类型字典
        /// </summary>
        public string ExamType { get; set; }

        /// <summary>
        /// 随访方式 WS364.12 CV06.00.207
        /// </summary>
        public string VisitWay { get; set; }


        /// <summary>
        /// 随访医生姓名
        /// </summary>
        public string Doctor { get; set; }

        public Nullable<System.DateTime> CreateDate { get; set; }
        public string CreateBy { get; set; }
        public Nullable<System.DateTime> UpdateDate { get; set; }
        public string UpdateBy { get; set; }
        public Nullable<byte> Status { get; set; }

    }
}
