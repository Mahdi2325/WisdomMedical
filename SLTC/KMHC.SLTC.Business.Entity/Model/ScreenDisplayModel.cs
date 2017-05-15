using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class ScreenDisplayModel
    {
        /// <summary>
        /// 基础信息
        /// </summary>
        public List<ScreenBaseInfo> InfoList { get; set; }
        /// <summary>
        /// 当前所属科室
        /// </summary>
        public string deptName { get; set; }

        /// <summary>
        /// 当前所属科室Id
        /// </summary>
        public int deptId { get; set; }

      
    }


    public class ScreenBaseInfo
    {
        /// <summary>
        /// 会员姓名
        /// </summary>
        public string ResidentName { get; set; }

        /// <summary>
        /// 当天序号/报号时用到
        /// </summary>
        public string SerialNumber { get; set; }

        /// <summary>
        /// 当前状态
        /// </summary>
        public int CheckStatus { get; set; }

        /// <summary>
        /// 当前状态-状态 2.候检 3.就检中
        /// </summary>
        public string CheckStatusValue { get; set; }

        /// <summary>
        /// 下一服务科室
        /// </summary>
        public string nextDeptName { get; set; }

        /// <summary>
        /// 订单编号
        /// </summary>
        public int ServiceOrderID { get; set; }

        /// <summary>
        /// 实际检查序号
        /// </summary>
        public int CheckNumber { get; set; }

        /// <summary>
        /// 序号
        /// </summary>
        public int displayIndex { get; set; }
    }

    public class BaiduToken
    {
        public int TokenID { get; set; }
        public string TokenValue { get; set; }
        public DateTime? ExpiredTime { get; set; }
        public DateTime? CreateTime { get; set; }
    }
}
