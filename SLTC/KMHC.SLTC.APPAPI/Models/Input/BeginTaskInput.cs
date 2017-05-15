using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.APPAPI.Models.Input
{
    /// <summary>
    /// 任务签到输入参数
    /// </summary>
    public class BeginTaskInput : ResidentInfo
    {
        /// <summary>
        /// 员工id
        /// </summary>
        public string EmployeeId { get; set; }
        /// <summary>
        /// 任务id
        /// </summary>
        public int TaskId { set; get; }
        /// <summary>
        /// 经度
        /// </summary>
        public float StartLng { set; get; }
        /// <summary>
        /// 维度
        /// </summary>
        public float StartLat { set; get; }
    }

    public class ResidentInfo
    {       
        /// <summary>
        /// 会员ID
        /// </summary>
        public int ResidentID { get; set; }
        /// <summary>
        /// 姓名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 身份证
        /// </summary>
        public string IdCard { get; set; }
        /// <summary>
        /// 性别
        /// </summary>
        public string Sex { get; set; }

    }
}