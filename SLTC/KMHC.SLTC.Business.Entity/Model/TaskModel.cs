namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class TaskModel
    {
        public int TaskID { get; set; }
        public int OrganizationID { get; set; }
        public int? EmployeeId { get; set; }
        public string EmployeeName { get; set; }
        public string Nationality { get; set; }
        public int PersonID { get; set; }
        public string PersonName { get; set; }
        public string Sex { get; set; }
        public string Phone { get; set; }
        public string Address { get; set; }
        public Nullable<float> Lng { get; set; }
        public Nullable<float> Lat { get; set; }
        public Nullable<System.DateTime> AppointmentTime { get; set; }
        public int ServiceOrderID { get; set; }
        public string ServiceType { get; set; }
        public string ServiceName { get; set; }
        public Nullable<decimal> Price { get; set; }
        public string TaskNo { get; set; }
        public string SONo { get; set; }
        public Nullable<System.DateTime> BeginTime { get; set; }
        public string StartPos { get; set; }
        public Nullable<float> StartLng { get; set; }
        public Nullable<float> StartLat { get; set; }
        public Nullable<System.DateTime> EndTime { get; set; }
        public string EndPos { get; set; }
        public Nullable<float> EndLng { get; set; }
        public Nullable<float> EndLat { get; set; }
        public string Status { get; set; }
        public string Remark { get; set; }
        public Nullable<int> ExecutorId { get; set; }
        public string Executor { get; set; }
        public Nullable<int> OperatorId { get; set; }
        public string Operator { get; set; }
        public Nullable<System.DateTime> OperatorTime { get; set; }
        public string Satisfaction { get; set; }
        public string CurryOutRemark { get; set; }
        public int CreatedBy { get; set; }
        public System.DateTime CreatedTime { get; set; }
        public int ModifiedBy { get; set; }
        public System.DateTime ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public DateTime? Birthdate { get; set; }
        public string PhotoPath { get; set; }
        public bool? IsChange { get; set; }
        public bool? IsCancel { get; set; }
        public string Keywords { get; set; }
        public string CancelReason { get; set; }
        public bool IsNeedChangeAudit { get; set; }
        public bool HasChange { get; set; }
        public bool IsRefund { get; set; }
        public string Payment { get; set; }
       
    }
}
