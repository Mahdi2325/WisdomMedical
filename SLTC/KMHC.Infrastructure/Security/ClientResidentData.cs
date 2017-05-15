using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.Infrastructure.Security
{
    public class ClientResidentData : IClientLoginUser
    {
        /// <summary>
        /// 会员Id
        /// </summary>
        public int ResidentID { get; set; }
        /// <summary>
        /// 会员编号
        /// </summary>
        public string ResidentNo { get; set; }
        /// <summary>
        /// 登录名
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 会员姓名
        /// </summary>
        public string ResidentName { get; set; }
        /// <summary>
        /// 当前组织结构Id
        /// </summary>
        public int? OrgId { get; set; }
        /// <summary>
        /// 机构地址
        /// </summary>
        public string OrgAddress { get; set; }
        /// <summary>
        /// 机构电话
        /// </summary>
        public string OrgPhone { get; set; }

        /// <summary>
        /// 档案ID
        /// </summary>
        public int PersonID { get; set; }
        /// <summary>
        /// 区域ID
        /// </summary>
        public int AreaID { get; set; }
        public string UserType { get; set; }
    }
}
