using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.APPAPI.Models.Input
{
    /// <summary>
    /// 获取任务列表的参数
    /// </summary>
    public class GetMyTaskListInput
    {
        private int employeeId;
        /// <summary>
        /// 员工编号
        /// </summary>
        public int EmployeeId
        {
            get { return employeeId; }
            set { employeeId = value; }
        }
        private int currentPage = 1;
        /// <summary>
        /// 当前页
        /// </summary>
        public int CurrentPage
        {
            get { return currentPage; }
            set { currentPage = value; }
        }
        private int pageSize = 10;
        /// <summary>
        /// 一页多少行
        /// </summary>
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value; }
        }
        /// <summary>
        /// 机构ID
        /// </summary>
        public int OrganizationID { get; set; }
        /// <summary>
        /// 预约起始时间
        /// </summary>
        public DateTime? AppointmentTimeStart { get; set; }
        /// <summary>
        /// 预约结束时间
        /// </summary>
        public DateTime? AppointmentTimeEnd { get; set; }
        /// <summary>
        /// 工单状态
        /// </summary>
        public string[] Status { get; set; }
        /// <summary>
        /// 是否已改签
        /// </summary>
        public bool? IsChange { get; set; }
        /// <summary>
        /// 是否改签过
        /// </summary>
        public bool? HasChange { get; set; }
        /// <summary>
        /// 是否取消
        /// </summary>
        public bool? IsCancel { get; set; }
        /// <summary>
        /// 关键字查询
        /// </summary>
        public string Keywords { get; set; }
    }
    public class GetResidentServicedInput
    {
        /// <summary>
        /// 会员员工ID
        /// </summary>
        public int PersonID { get; set; }
        /// <summary>
        /// 会员员工ID
        /// </summary>
        public int EmployeeId { get; set; }
        /// <summary>
        /// 机构ID
        /// </summary>
        public int OrganizationID { get; set; }
        private int currentPage = 1;
        /// <summary>
        /// 当前页
        /// </summary>
        public int CurrentPage
        {
            get { return currentPage; }
            set { currentPage = value; }
        }
        private int pageSize = 10;
        /// <summary>
        /// 一页多少行
        /// </summary>
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value; }
        }
    }
    public class GetMyPerformanceInput
    {
        private int employeeId;
        /// <summary>
        /// 员工编号
        /// </summary>
        public int EmployeeId
        {
            get { return employeeId; }
            set { employeeId = value; }
        }
        private int currentPage = 1;
        /// <summary>
        /// 当前页
        /// </summary>
        public int CurrentPage
        {
            get { return currentPage; }
            set { currentPage = value; }
        }
        private int pageSize = 10;
        /// <summary>
        /// 一页多少行
        /// </summary>
        public int PageSize
        {
            get { return pageSize; }
            set { pageSize = value; }
        }
        /// <summary>
        /// 机构ID
        /// </summary>
        public int OrganizationID { get; set; }
        /// <summary>
        /// 完成起始时间
        /// </summary>
        public DateTime? EndTimeStart { get; set; }
        /// <summary>
        /// 完成结束时间
        /// </summary>
        public DateTime? EndTimeEnd { get; set; }
        /// <summary>
        /// 工单状态
        /// </summary>
        public string[] Status { get; set; }
    }
    public class GetTaskNumberInput
    {
        private int employeeId;
        /// <summary>
        /// 员工编号
        /// </summary>
        public int EmployeeId
        {
            get { return employeeId; }
            set { employeeId = value; }
        }
       
        /// <summary>
        /// 机构ID
        /// </summary>
        public int OrganizationID { get; set; }
       
    }
}