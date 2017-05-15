using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.Infrastructure.Security
{
    public class ClientUserData : IClientLoginUser
    {
        /// <summary>
        /// 用户Id
        /// </summary>
        public int UserId { get; set; }
        /// <summary>
        /// 登录名
        /// </summary>
        public string LoginName { get; set; }
        /// <summary>
        /// 用户名
        /// </summary>
        public string EmpName { get; set; }
        /// <summary>
        /// 当前组织结构Id
        /// </summary>
        public int OrgId { get; set; }

        //当时集团的Id
        public int GroupId { get; set; }

        /// <summary>
        /// 组织结构Ids
        /// </summary>
        public int[] OrgIds { get; set; }
        /// <summary>
        /// 工号
        /// </summary>
        public int EmpId { get; set; }
        /// <summary>
        /// 事業類型
        /// </summary>
        public string EmpGroup { get; set; }
        /// <summary>
        /// 职称
        /// </summary>
        public string JobTitle { get; set; }
        /// <summary>
        /// 职别
        /// </summary>
        public string JobType { get; set; }
        public string Email { get; set; }

        /// <summary>
        /// 角色Id
        /// </summary>
        public int RoleId { get; set; }
        /// <summary>
        /// 角色类型
        /// </summary>
        public string RoleType { get; set; }

        /// <summary>
        /// 是否是超级管理员
        /// </summary>
        public bool IsSurperAdmin { get; set; }

        /// <summary>
        /// 是否是集团管理员
        /// </summary>
        public bool IsGroupAdmin { get; set; }

        ///// <summary>
        ///// 角色类型
        ///// </summary>
        //public string[] RoleType { get; set; }

        //public string[] DCRoleType { get; set; }
        //public string[] LTCRoleType { get; set; }
        /// <summary>
        /// 系统类型
        /// </summary>
        public string[] SysType { get; set; }

        public string CurrentLoginSys { get; set; }
        public string UserType { get; set; }
        /// <summary>
        /// 机构地址
        /// </summary>
        public string OrgAddress { get; set; }
        /// <summary>
        /// 机构电话
        /// </summary>
        public string OrgPhone { get; set; }
        /// <summary>
        /// 机构Logo
        /// </summary>
        public string LogoPath { get; set; }
        /// <summary>
        /// 所属部门、科室
        /// </summary>
        public int? DeptID { get; set; }
        /// <summary>
        /// 所属诊室
        /// </summary>
        public int? CheckRoomID { get; set; }
    }
}
