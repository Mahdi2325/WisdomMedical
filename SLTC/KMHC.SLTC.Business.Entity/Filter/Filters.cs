using System.Dynamic;

namespace KMHC.SLTC.Business.Entity.Filter
{
    using KMHC.Infrastructure;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    /// <summary>
    /// 通用关键字过滤条件
    /// </summary>
    public class CommonFilter
    {
        public string KeyWords { get; set; }
    }

    public class BaseFilter
    {
        private int organizationID = 0;
        public int type = 0;
        public int OrganizationID
        {
            get
            {
                if (this.organizationID == 0 && type == 0)
                {
                    return SecurityHelper.CurrentPrincipal == null ? 0 : SecurityHelper.CurrentPrincipal.OrgId;
                }
                else
                {
                    return this.organizationID;
                }
            }
            set
            {
                this.organizationID = value;
            }
        }
    }

    public partial class ActivityNewFilter : BaseFilter
    {
        public int ActivityNewID { get; set; }
    }

    public partial class BillFilter : BaseFilter
    {
        public int ResidentID { get; set; }
        public int BillID { get; set; }
        public DateTime? BillDateFrom { get; set; }
        public DateTime? BillDateTo { get; set; }
    }

    public partial class ChargeItemFilter : BaseFilter
    {
        public int? ChargeItemID { get; set; }
        public string CIName { get; set; }
    }

    public partial class CommodityItemFilter : BaseFilter
    {
        public int? CommodityItemID { get; set; }
        public int? CICategory { get; set; }
        public string CIName { get; set; }
    }

    public partial class CodeRuleFilter : BaseFilter
    {
        public int CodeRuleID { get; set; }
        public string CodeKey { get; set; }
        public string GenerateRule { get; set; }
        public string Prefix { get; set; }
        public int SerialNumberLength { get; set; }
    }

    public partial class DepositFilter : BaseFilter
    {
        public int DepositID { get; set; }
    }

    public partial class MonitorItemFilter : BaseFilter
    {
        public int MonitoritemID { get; set; }
    }

    public partial class MonitorResultFilter : BaseFilter
    {
        public int MonitorResultID { get; set; }
    }

    public partial class MonitorTemplateFilter : BaseFilter
    {
        public int MonitorTemplateID { get; set; }
    }

    public partial class PaymentFilter : BaseFilter
    {
        public int PaymentID { get; set; }

        public int ResidentID { get; set; }

        public string PayType { get; set; }

        public DateTime? PayDateFrom { get; set; }
        public DateTime? PayDateTo { get; set; }
    }

    public partial class PersonFilter : BaseFilter
    {
        public int PersonID { get; set; }

        public string PersonName { get; set; }

        public string SearchKey { get; set; }

        public string AuditState { get; set; }
    }

    public partial class ResidentFilter : BaseFilter
    {
        public int? ResidentId { get; set; }
        public int? PersonId { get; set; }
        public int[] ResidentIDs { get; set; }

        public string PersonName { get; set; }

        public string Sex { get; set; }
        public bool HasLocation { get; set; }
        public string Keywords { get; set; }
    }

    public partial class ResidentServicePlanFilter : BaseFilter
    {
        public int? ResidentId { get; set; }
        public int ResidentServicePlanID { get; set; }
    }

    public partial class ResidentServicePlanItemFilter : BaseFilter
    {
        public int ResidentServicePlanItemID { get; set; }
    }

    public partial class SerOrdSerItFilter : BaseFilter
    {
        public int ServiceOrderSIID { get; set; }
    }

    public partial class FeeDetailFilter : BaseFilter
    {
        public int ResidentID { get; set; }
        public int BillID { get; set; }
        public int FeeDetailID { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }

    public partial class ServiceGroupFilter : BaseFilter
    {
        public int? ServiceGroupID { get; set; }
        public string Status { get; set; }
        public string KeyWords { get; set; }
        public int? ResidentID { get; set; }
    }

    public partial class ServiceItemFilter : BaseFilter
    {
        public int? ServiceItemID { get; set; }
        public string KeyWords { get; set; }
        public int? ServiceItemCategoryID { get; set; }
        public List<int> ServiceItemIds { get; set; }
        public int? ResidentID { get; set; }
        public string SIBelong { get; set; }
        public int[] SelectedItemIDs { get; set; }
    }

    public partial class ServiceItemCategoryFilter : BaseFilter
    {
        public int ServiceItemCategoryID { get; set; }
        public string KeyWords { get; set; }
    }
    public partial class CommodityTypeFilter : BaseFilter
    {
        public int CommodityTypeID { get; set; }
        public string KeyWords { get; set; }
    }
    public partial class ServiceOrderFilter : BaseFilter
    {
        public int ServiceOrderID { get; set; }
        public int ResidentID { get; set; }
        public string KeyWords { get; set; }
        public bool? IsDeleted { get; set; }
        public string[] PaymentStatus { get; set; }
        public string[] OrderStatus { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
        public DateTime? AppDate { get; set; }
        public int? ServiceType { get; set; }
    }

    public partial class TaskFilter : BaseFilter
    {
        public int TaskID { get; set; }
        public string Name { get; set; }
        public int EmployeeId { get; set; }
        public int PersonID { get; set; }
        public string[] Status { get; set; }
        public string SingleStatus { get; set; }
        public int ServiceOrderID { get; set; }
        public DateTime? AppointmentTimeStart { get; set; }
        public DateTime? AppointmentTimeEnd { get; set; }
        public DateTime? EndTimeStart { get; set; }
        public DateTime? EndTimeEnd { get; set; }
        public bool StartHasLocation { get; set; }
        public bool EndHasLocation { get; set; }
        public bool? IsChange { get; set; }
        public bool? IsCancel { get; set; }
        public string Keywords { get; set; }
        public bool? HasChange { get; set; }
    }
    public partial class TaskRecordFilter : BaseFilter
    {
        public int ID { get; set; }
        public int TaskID { get; set; }
        public DateTime? AppointmentTime { get; set; }
        public string Result { get; set; }
        public bool IsAudit { get; set; }
    }
    public partial class Task4PhoneFilter
    {
        public int EmployeeId { get; set; }
        public string[] Status { get; set; }
    }

    public partial class DispatchTaskFilter : BaseFilter
    {
        public DateTime CurrentDate { get; set; }
        public string KeyWords { get; set; }
        public string JobTitle { get; set; }
    }

    public partial class WatchRecordFilter : BaseFilter
    {
        public int WatchRecordID { get; set; }
    }

    public partial class AreaFilter : BaseFilter
    {
        public int AreaID { get; set; }
        public string AreaName { get; set; }
    }

    public partial class BedFilter
    {
        public int BedID { get; set; }
    }

    public partial class EmployeeFilter : BaseFilter
    {
        public int EmployeeID { get; set; }
        public int[] EmployeeIDs { get; set; }
        public string EmpNo { get; set; }
        public string EmpName { get; set; }
        public string[] JobTitle { get; set; }
        public int? UserId { get; set; }

        public string SearchWords { get; set; }

        public string EmpState { get; set; }


    }

    public partial class FloorFilter : BaseFilter
    {
        public int FloorID { get; set; }
    }

    public partial class GroupFilter : BaseFilter
    {
        public int GroupID { get; set; }

        public string GroupName { get; set; }

    }

    public partial class OrganizationFilter : BaseFilter
    {
        public string OrgName { get; set; }
        public int[] OrgIds { get; set; }
        public bool IsGroupAdmin { get; set; }
        public int GroupID { get; set; }
    }

    public partial class RoomFilter : BaseFilter
    {
        public int RoomID { get; set; }
    }

    public partial class DictionaryFilter : BaseFilter
    {
        public string KeyWords { get; set; }
        public int DictionaryID { get; set; }
        public string ItemType { get; set; }
    }

    public partial class DictionaryItemFilter : BaseFilter
    {
        public int DictionaryItemID { get; set; }
        public string ItemType { get; set; }
        public string[] ItemTypes { get; set; }
    }

    public partial class FunctionFilter : BaseFilter
    {
        public string Keywords { get; set; }
        public int FunctionID { get; set; }
        public string FunctionNo { get; set; }
        public string FunctionName { get; set; }
    }

    public partial class RoleFilter : BaseFilter
    {
        public int? RoleID { get; set; }
        public string RoleName { get; set; }

    }

    public partial class UserFilter : BaseFilter
    {
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string Password { get; set; }

        /// <summary>
        /// 是否是超级管理员 Admin
        /// </summary>
        public bool IsSupperAdmin { get; set; }

        /// <summary>
        /// 是否是集团管理员
        /// </summary>
        public bool IsGroupAdmin { get; set; }
        /// <summary>
        /// 集团id
        /// </summary>
        public int GroupId { get; set; }

    }

    public partial class UserRelationFilter : BaseFilter
    {
        public int UserRelationID { get; set; }
    }

    public class RoleFunctionFilter : BaseFilter
    {
        public int RoleID { get; set; }
        public bool IsSuperAdmin { get; set; }
    }

    public class VolunteerFilter : BaseFilter
    {
        public string Keywords { get; set; }
    }
    public class GroupActivityCategoryFilter : BaseFilter
    {
        public string Keywords { get; set; }
    }
    public class GroupActivityRecordFilter : BaseFilter
    {
        public string Keywords { get; set; }
        public DateTime? StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public int? CategoryID { get; set; }
        public int? ItemID { get; set; }
        public int? AreaID { get; set; }
    }
    public class GroupActivityTaskFilter : BaseFilter
    {
        public string StartTime { get; set; }
        public string EndTime { get; set; }
    }
    public class EmpPlanFilter : BaseFilter
    {
        public int Quantity { get; set; }
        public float Unit { get; set; }
    }

    public partial class RefundRecordFilter : BaseFilter
    {
        public int ID { get; set; }
        public int ServiceOrderID { get; set; }
        public string Reason { get; set; }
        public decimal Fund { get; set; }
        public string Reply { get; set; }
        public string Status { get; set; }
    }

    public class SOSFileter : BaseFilter
    {
        public string data { get; set; }
    }

    public class ActivitySignFileter : BaseFilter
    {
        public int ActivityID { get; set; }
        public int UserID { get; set; }
        public string UserName { get; set; }
        public string UserType { get; set; }
    }

    public class ContractFilter : BaseFilter
    {
        public int? PersonID { get; set; }
        public string ContractNo { get; set; }
    }

    public class DeviceFilter : BaseFilter
    {
        public int? PersonID { get; set; }
    }
    public class FamilyFilter : BaseFilter
    {
        public int? PersonID { get; set; }
        public bool? IsEmerg { get; set; }
    }
    public class HabitFilter : BaseFilter
    {
        public int? PersonID { get; set; }
    }
    public class PriorityRemarkFilter : BaseFilter
    {
        public int? PersonID { get; set; }
    }
    public class EvaluationFilter : BaseFilter
    {
        public int? EmployeeID { get; set; }
        public int? ServiceOrderID { get; set; }
    }

    public class CallInfoFilter : BaseFilter
    {
        public int? PersonID { get; set; }
    }

    public partial class HealthFilter : BaseFilter
    {
        public string IdCard { get; set; }
        public DateTime? StartDate { get; set; }
        public DateTime? EndDate { get; set; }
    }


    public partial class DeptFilter : BaseFilter
    {
        public int? DeptID { get; set; }
        public string DeptName { get; set; }
    }

    public partial class ServiceAppFilter : BaseFilter
    {
        public int? ServiceAppID { get; set; }
        public int? ResidentID { get; set; }
        public DateTime? ServiceDate { get; set; }
        public string Status { get; set; }
    }
    public partial class PaymentsFilter : BaseFilter
    {
        public int ResidentID { get; set; }
        public int? ServiceType { get; set; }
    }

    public partial class SyncQueueModel : BaseFilter
    {
        public int[] OrderSiIds { get; set; }
        public int OperatorId { get; set; }
    }
}
