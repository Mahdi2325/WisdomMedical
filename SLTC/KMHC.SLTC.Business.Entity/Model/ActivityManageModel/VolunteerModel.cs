using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class VolunteerModel
    {
        public int EmployeeId { get; set; }
        public string EmpName { get; set; }
        public decimal TotalHours { get; set; }
        public List<GroupActivityItem> groupActivityItem { get; set; }
        public bool IsDeleted { get; set; }
        public int OrganizationId { get; set; }

    }
    public class GroupActivityCategory
    {
        public int ID { get; set; }
        public string CategoryName { get; set; }
        public string Remark { get; set; }
        public string CreateBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int OrganizationID { get; set; }
        public bool IsDeleted { get; set; }
        public int OrganizationId { get; set; }
        public List<GroupActivityItem> GroupActivityItem { get; set; }
    }
    public class GroupActivityItem
    {
        public int ID { get; set; }
        public int GroupactivitycategoryID { get; set; }
        public string ItemName { get; set; }
        public string Remark { get; set; }
        public bool? Isdeleted { get; set; }
        public decimal Hours { get; set; }
        public int OrderId { get; set; }
        public string Action { get; set; }

    }

    public class GroupActivityRecord
    {
        public int Id { get; set; }
        public int CategoryId { get; set; }
        public int ItemId { get; set; }
        public string ActivityName { get; set; }
        public string ActivityContent { get; set; }
        public DateTime StartTime { get; set; }
        public decimal Hours { get; set; }
        public DateTime EndTime { get; set; }
        public string EmployeeIds { get; set; }
        public string MemberIds { get; set; }
        public int OrganizationId { get; set; }

    }

    public class GroupActivityTask
    {
        public Nullable<int> EmployeeId { get; set; }
        public Nullable<System.DateTime> BeginTime { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public bool IsDeleted { get; set; }
        public string Status { get; set; }
        public int OrganizationId { get; set; }
    }
}
