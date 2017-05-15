using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.APPAPI.Models.Input
{
    /// <summary>
    /// 任务签到输入参数
    /// </summary>
    public class FinishTaskInput : ResidentInfo
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
        public float EndLng { set; get; }
        /// <summary>
        /// 维度
        /// </summary>
        public float EndLat { set; get; }
    }
}