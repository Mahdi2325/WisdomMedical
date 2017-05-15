using KMHC.Infrastructure.Common;

namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    public partial class TaskService : BaseService, ITaskService
    {
        #region DC_Task
        public BaseResponse<IList<TaskModel>> QueryTask(BaseRequest<TaskFilter> request)
        {
           
            BaseResponse<IList<TaskModel>> response = new BaseResponse<IList<TaskModel>>();
            var taskChangeRepository = from a in unitOfWork.GetRepository<DC_TaskChangeRecord>().dbSet
                                 group a by a.TaskID into g
                                 select new
                                 {
                                     TaskID =g.Key,
                                     NumChange = g.Count() 
                                 };
            var q = from t in unitOfWork.GetRepository<DC_Task>().dbSet.Where(a => a.IsDeleted == false)
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a => a.IsDeleted == false)
                    on t.PersonID equals p.PersonID
                    join x in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                    on t.ServiceOrderID equals x.ServiceOrderID
                    join m in taskChangeRepository on t.TaskID equals m.TaskID.Value into taskChange
                    from n in taskChange.DefaultIfEmpty()
                    select  new TaskModel
                    {
 TaskID=t.TaskID,
 OrganizationID = t.OrganizationID,
 EmployeeId = t.EmployeeId,
 EmployeeName = t.EmployeeName,
 PersonID = t.PersonID,
 PersonName = t.PersonName,
 Sex = t.Sex,
 Phone = t.Phone,
 Address = t.Address,
 AppointmentTime = t.AppointmentTime,
 ServiceOrderID = t.ServiceOrderID,
 ServiceType = t.ServiceType,
 ServiceName = t.ServiceName,
 Price = t.Price,
 TaskNo = t.TaskNo,
 SONo = t.SONo,
 BeginTime = t.BeginTime,
 StartPos = t.StartPos,
 StartLng = t.StartLng,
 StartLat = t.StartLat,
 EndTime = t.EndTime,
 EndPos = t.EndPos,
 EndLng = t.EndLng,
 EndLat = t.EndLat,
 Status = t.Status,
 Remark = t.Remark,
 ExecutorId = t.ExecutorId,
 Executor = t.Executor,
 OperatorId = t.OperatorId,
 Operator = t.Operator,
 OperatorTime = t.OperatorTime,
 Satisfaction = t.Satisfaction,
 CurryOutRemark = t.CurryOutRemark,
 CreatedBy = t.CreatedBy,
 CreatedTime = t.CreatedTime,
 ModifiedBy = t.ModifiedBy,
 ModifiedTime = t.ModifiedTime,
 IsDeleted = t.IsDeleted,
 Birthdate=p.Birthdate,
 PhotoPath=p.PhotoPath,
 IsCancel=t.IsCancel,
 IsChange=t.IsChange,
 HasChange = n.NumChange>0,
 Payment = x.Payment
                    };
            if (request == null || request.Data == null)
            {
                response.IsSuccess = false;
                return response;
            }

            if (request.Data.TaskID != 0)
            {
                q = q.Where(m => m.TaskID == request.Data.TaskID);
            }
            if (request.Data.OrganizationID != 0)
            {
                q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
            }
            if (request.Data.IsCancel!=null)
            {
                q = q.Where(m => (m.IsCancel == null ? false : m.IsCancel.Value) == request.Data.IsCancel);
            }
            if (request.Data.IsChange != null)
            {
                q = q.Where(m => (m.IsChange == null ? false : m.IsChange.Value) == request.Data.IsChange);
            }
            if (request.Data.HasChange != null)
            {
                q = q.Where(m => m.HasChange == request.Data.HasChange);
            }
            if (!string.IsNullOrEmpty(request.Data.Keywords))
            {
                q = q.Where(m => m.Phone.Contains(request.Data.Keywords) || m.PersonName.Contains(request.Data.Keywords) || m.ServiceName.Contains(request.Data.Keywords));
            }
            if (!string.IsNullOrEmpty(request.Data.Name))
            {
                q = q.Where(m => m.PersonName.Contains(request.Data.Name));
            }
            if (request.Data.EmployeeId != 0)
            {
                q = q.Where(m => m.EmployeeId == request.Data.EmployeeId);
            }
            if (request.Data.PersonID != 0)
            {
                q = q.Where(m => m.PersonID == request.Data.PersonID);
            }
            if (request.Data.ServiceOrderID != 0)
            {
                q = q.Where(m => m.ServiceOrderID == request.Data.ServiceOrderID);
            }
            if (request.Data.Status != null && request.Data.Status.Length > 0)
            {
                q = q.Where(m => request.Data.Status.Contains(m.Status));
            }
            if (!string.IsNullOrEmpty(request.Data.SingleStatus))
            {
                if (request.Data.SingleStatus=="Cancel")
                {
                    q = q.Where(m => m.IsCancel.Value);
                }
                else
                {
                    q = q.Where(m => m.Status == request.Data.SingleStatus && !m.IsCancel.Value);
                }
            }
            if (request.Data.AppointmentTimeStart.HasValue)
            {
                q = q.Where(m => m.AppointmentTime.Value.CompareTo(request.Data.AppointmentTimeStart.Value) >= 0);
            }
            if (request.Data.AppointmentTimeEnd.HasValue)
            {
                q = q.Where(m => m.AppointmentTime.Value.CompareTo(request.Data.AppointmentTimeEnd.Value) < 0);
            }
            if (request.Data.EndTimeStart.HasValue)
            {
                q = q.Where(m => m.EndTime.HasValue && m.EndTime.Value.CompareTo(request.Data.EndTimeStart.Value) >= 0);
            }
            if (request.Data.EndTimeEnd.HasValue)
            {
                q = q.Where(m => m.EndTime.HasValue && m.EndTime.Value.CompareTo(request.Data.EndTimeEnd.Value) <= 0);
            }
            if (request.Data.StartHasLocation)
            {
                q = q.Where(m => m.StartLng != null && m.StartLat != null);
            }
            if (request.Data.EndHasLocation)
            {
                q = q.Where(m => m.EndLng != null && m.EndLat != null);
            }
            q = q.OrderByDescending(m => m.CreatedTime);
            response.RecordsCount = q.Count();

            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }
            else
            {
                var list = q.ToList();
                response.Data = list;
            }
            //判断是否需要改签审核
            if (response.RecordsCount > 0)
            {
                var status = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
                var finishStatus = Enum.GetName(typeof(TaskStatus), TaskStatus.Finish);
                var taskChangeRecords = base.unitOfWork.GetRepository<DC_TaskChangeRecord>().dbSet.Where(a => !a.IsDeleted && !a.IsAudit.Value);
                var refundRepository = base.unitOfWork.GetRepository<DC_RefundRecord>().dbSet.Where(a => a.Status == status);
                foreach (var item in response.Data)
                {
                    var cp = taskChangeRecords.Where(w => w.TaskID == item.TaskID).ToList();
                    item.IsNeedChangeAudit = cp.Any();
                    item.IsRefund = ((item.IsCancel != null && item.IsCancel.Value) || item.Status == finishStatus) ? false : refundRepository.Any(a => a.ServiceOrderID == item.ServiceOrderID);
                }
            }
            return response;
        }
        public BaseResponse<PerformanceModel> GetMyPerformance(BaseRequest<TaskFilter> request)
        {
            var taskChangeRepository = from a in unitOfWork.GetRepository<DC_TaskChangeRecord>().dbSet
                                       group a by a.TaskID into g
                                       select new
                                       {
                                           TaskID = g.Key,
                                           NumChange = g.Count()
                                       };

            BaseResponse<PerformanceModel> response = new BaseResponse<PerformanceModel>();
            var q = from t in unitOfWork.GetRepository<DC_Task>().dbSet.Where(a => a.IsDeleted == false)
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a => a.IsDeleted == false)
                    on t.PersonID equals p.PersonID
                    join m in taskChangeRepository on t.TaskID equals m.TaskID.Value into taskChange
                    from n in taskChange.DefaultIfEmpty()
                    select new TaskModel
                    {
                        TaskID = t.TaskID,
                        OrganizationID = t.OrganizationID,
                        EmployeeId = t.EmployeeId,
                        EmployeeName = t.EmployeeName,
                        PersonID = t.PersonID,
                        PersonName = t.PersonName,
                        Sex = t.Sex,
                        Phone = t.Phone,
                        Address = t.Address,
                        AppointmentTime = t.AppointmentTime,
                        ServiceOrderID = t.ServiceOrderID,
                        ServiceType = t.ServiceType,
                        ServiceName = t.ServiceName,
                        Price = t.Price,
                        TaskNo = t.TaskNo,
                        SONo = t.SONo,
                        BeginTime = t.BeginTime,
                        StartPos = t.StartPos,
                        StartLng = t.StartLng,
                        StartLat = t.StartLat,
                        EndTime = t.EndTime,
                        EndPos = t.EndPos,
                        EndLng = t.EndLng,
                        EndLat = t.EndLat,
                        Status = t.Status,
                        Remark = t.Remark,
                        ExecutorId = t.ExecutorId,
                        Executor = t.Executor,
                        OperatorId = t.OperatorId,
                        Operator = t.Operator,
                        OperatorTime = t.OperatorTime,
                        Satisfaction = t.Satisfaction,
                        CurryOutRemark = t.CurryOutRemark,
                        CreatedBy = t.CreatedBy,
                        CreatedTime = t.CreatedTime,
                        ModifiedBy = t.ModifiedBy,
                        ModifiedTime = t.ModifiedTime,
                        IsDeleted = t.IsDeleted,
                        Birthdate = p.Birthdate,
                        PhotoPath = p.PhotoPath,
                        IsCancel = t.IsCancel,
                        IsChange = t.IsChange,
                        HasChange = n.NumChange > 0
                    };
            if (request == null || request.Data == null)
            {
                response.IsSuccess = false;
                return response;
            }

            if (request.Data.TaskID != 0)
            {
                q = q.Where(m => m.TaskID == request.Data.TaskID);
            }
            if (request.Data.OrganizationID != 0)
            {
                q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
            }
            if (request.Data.IsCancel != null)
            {
                q = q.Where(m => (m.IsCancel == null ? false : m.IsCancel.Value) == request.Data.IsCancel);
            }
            if (request.Data.IsChange != null)
            {
                q = q.Where(m => (m.IsChange == null ? false : m.IsChange.Value) == request.Data.IsChange);
            }
            if (request.Data.HasChange != null)
            {
                q = q.Where(m => m.HasChange == request.Data.HasChange);
            }
            if (!string.IsNullOrEmpty(request.Data.Keywords))
            {
                q = q.Where(m => m.Phone.Contains(request.Data.Keywords) || m.PersonName.Contains(request.Data.Keywords));
            }
            if (!string.IsNullOrEmpty(request.Data.Name))
            {
                q = q.Where(m => m.PersonName.Contains(request.Data.Name));
            }
            if (request.Data.EmployeeId != 0)
            {
                q = q.Where(m => m.EmployeeId == request.Data.EmployeeId);
            }
            if (request.Data.ServiceOrderID != 0)
            {
                q = q.Where(m => m.ServiceOrderID == request.Data.ServiceOrderID);
            }
            if (request.Data.Status != null && request.Data.Status.Length > 0)
            {
                q = q.Where(m => request.Data.Status.Contains(m.Status));
            }
            if (request.Data.AppointmentTimeStart.HasValue)
            {
                q = q.Where(m => m.AppointmentTime.Value.CompareTo(request.Data.AppointmentTimeStart.Value) >= 0);
            }
            if (request.Data.AppointmentTimeEnd.HasValue)
            {
                q = q.Where(m => m.AppointmentTime.Value.CompareTo(request.Data.AppointmentTimeEnd.Value) <= 0);
            }
            if (request.Data.EndTimeStart.HasValue)
            {
                q = q.Where(m => m.EndTime.HasValue && m.EndTime.Value.CompareTo(request.Data.EndTimeStart.Value) >= 0);
            }
            if (request.Data.EndTimeEnd.HasValue)
            {
                q = q.Where(m => m.EndTime.HasValue && m.EndTime.Value.CompareTo(request.Data.EndTimeEnd.Value) <= 0);
            }
            if (request.Data.StartHasLocation)
            {
                q = q.Where(m => m.StartLng != null && m.StartLat != null);
            }
            if (request.Data.EndHasLocation)
            {
                q = q.Where(m => m.EndLng != null && m.EndLat != null);
            }
            q = q.OrderByDescending(m => m.CreatedTime);
            response.RecordsCount = q.Count();
            response.Data = new PerformanceModel();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data.taskList = list;
            }
            else
            {
                var list = q.ToList();
                response.Data.taskList = list;
            }
            var q2 = q.ToList();
            response.Data.completedTaskNum = q2.Count();
            response.Data.completedTaskAmount = q2.Sum(s => s.Price);
            return response;
        }
        public BaseResponse<TaskModel> GetTask(int taskID)
        {
            return base.Get<DC_Task, TaskModel>((q) => q.TaskID == taskID);
        }

        public BaseResponse<TaskModel> GetTaskInfo(int taskID)
        {
            BaseResponse<TaskModel> response = new BaseResponse<TaskModel>();
            var q = from t in unitOfWork.GetRepository<DC_Task>().dbSet.Where(a=>a.TaskID==taskID)
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet
                    on t.PersonID equals p.PersonID
                    join m in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                    on t.ServiceOrderID equals m.ServiceOrderID
                    select new TaskModel
                    {
                        TaskID = t.TaskID,
                        OrganizationID = t.OrganizationID,
                        EmployeeId = t.EmployeeId,
                        EmployeeName = t.EmployeeName,
                        Nationality = p.Nationality,
                        PersonID = t.PersonID,
                        PersonName = t.PersonName,
                        Sex = t.Sex,
                        Phone = t.Phone,
                        Address = t.Address,
                        AppointmentTime = t.AppointmentTime,
                        ServiceOrderID = t.ServiceOrderID,
                        ServiceType = t.ServiceType,
                        ServiceName = t.ServiceName,
                        Price = t.Price,
                        TaskNo = t.TaskNo,
                        SONo = t.SONo,
                        BeginTime = t.BeginTime,
                        StartPos = t.StartPos,
                        StartLng = t.StartLng,
                        StartLat = t.StartLat,
                        EndTime = t.EndTime,
                        EndPos = t.EndPos,
                        EndLng = t.EndLng,
                        EndLat = t.EndLat,
                        Status = t.Status,
                        Remark = t.Remark,
                        ExecutorId = t.ExecutorId,
                        Executor = t.Executor,
                        OperatorId = t.OperatorId,
                        Operator = t.Operator,
                        OperatorTime = t.OperatorTime,
                        Satisfaction = t.Satisfaction,
                        CurryOutRemark = t.CurryOutRemark,
                        CreatedBy = t.CreatedBy,
                        CreatedTime = t.CreatedTime,
                        ModifiedBy = t.ModifiedBy,
                        ModifiedTime = t.ModifiedTime,
                        IsDeleted = t.IsDeleted,
                        Birthdate = p.Birthdate,
                        PhotoPath = p.PhotoPath,
                        IsCancel = t.IsCancel,
                        IsChange = t.IsChange,
                        CancelReason = t.CancelReason,
                        Payment = m.Payment
                    };
            response.Data = q.ToList().FirstOrDefault();
            var taskChangeRecords = base.unitOfWork.GetRepository<DC_TaskChangeRecord>().dbSet.Where(a => a.TaskID == taskID);
            response.Data.HasChange = taskChangeRecords.Count() > 0;
            response.Data.IsNeedChangeAudit = taskChangeRecords.Any(a=>!a.IsAudit.Value);

            var status = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
            var finishStatus = Enum.GetName(typeof(TaskStatus), TaskStatus.Finish);
            var refund = base.unitOfWork.GetRepository<DC_RefundRecord>().dbSet.Where(a => a.Status == status && a.ServiceOrderID == response.Data.ServiceOrderID);
            response.Data.IsRefund = ((response.Data.IsCancel != null && response.Data.IsCancel.Value) || response.Data.Status == finishStatus) ? false : refund.Any();

            

            return response;
        }

        public BaseResponse<TaskNumber> GetTaskNumber(BaseRequest<TaskFilter> request)
        {
            BaseResponse<TaskNumber> response = new BaseResponse<TaskNumber>();
            var q= unitOfWork.GetRepository<DC_Task>().dbSet.Where(a =>a.EmployeeId==request.Data.EmployeeId&&
                a.OrganizationID==request.Data.OrganizationID
                && a.IsDeleted == false).ToList();
            response.Data = new TaskNumber() {
                completedTaskNum = q.Where(w => w.Status == "Finish").Count(),
                todayTaskNum = q.Where(w => w.AppointmentTime.ToString("yyyy-MM-dd") == DateTime.Now.ToString("yyyy-MM-dd")).Count()
            };
            return response;
        }
        public BaseResponse<TaskModel> SaveTask(TaskModel request)
        {
            BaseResponse<TaskModel> response = new BaseResponse<TaskModel>();
            if (request.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Execution) || request.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish))
            {
                var status = Enum.GetName(typeof(RefundStatus), RefundStatus.Wait);
                //查看是否存在退款中
                var refund = unitOfWork.GetRepository<DC_RefundRecord>().dbSet.FirstOrDefault(a => a.ServiceOrderID == request.ServiceOrderID && a.Status == status);
                if (refund != null)
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "此订单用户已申请退款。";
                    return response;
                }
            }

            response = base.Save<DC_Task, TaskModel>(request, (q) => q.TaskID == request.TaskID);
            if (response.IsSuccess)
            {
                if (response.Data.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Assign) || response.Data.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish))
                {
                    var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
                    var serviceOrder = serviceOrderRepository.dbSet.Where(a => a.ServiceOrderID == response.Data.ServiceOrderID).FirstOrDefault();
                    var orderStatus = Enum.GetName(typeof(OrderStatus), OrderStatus.Delivered);
                    if (response.Data.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish))
                    {
                        orderStatus = Enum.GetName(typeof(OrderStatus), OrderStatus.Finish);
                        serviceOrder.PaymentStatus = Enum.GetName(typeof(PaymentStatus), PaymentStatus.Paid);

                        if (serviceOrder.Payment == Enum.GetName(typeof(Payment), Payment.Cash))
                        {
                            var feeDetail = new DC_FeeDetail();
                            feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, response.Data.OrganizationID);
                            feeDetail.ServiceOrderID = serviceOrder.ServiceOrderID;
                            feeDetail.FeeName = serviceOrder.OrderTitle;
                            feeDetail.TotalPrice = -1 * serviceOrder.Price;
                            feeDetail.FeeDate = DateTime.Now;
                            feeDetail.ResidentID = serviceOrder.ResidentID;
                            unitOfWork.GetRepository<DC_FeeDetail>().Insert(feeDetail);
                        }
                    }

                    if (response.Data.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Assign))
                    {
                        serviceOrder.SelEmployeeID = response.Data.EmployeeId;
                    }

                    serviceOrder.OrderStatus = orderStatus;
                    serviceOrder.ModifiedTime = DateTime.Now;
                    serviceOrderRepository.Update(serviceOrder);

                    if (response.Data.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Assign))
                    {
                        var taskDispatchRecord = unitOfWork.GetRepository<DC_DispathTaskRecord>().dbSet.Where(a => a.OrderID == serviceOrder.ServiceOrderID).FirstOrDefault();
                        if (taskDispatchRecord==null)
                        {
                            taskDispatchRecord = new DC_DispathTaskRecord();
                            taskDispatchRecord.EmployeeID = response.Data.EmployeeId;
                            taskDispatchRecord.WorkTime = response.Data.AppointmentTime;
                            taskDispatchRecord.ClientName = response.Data.PersonName;
                            taskDispatchRecord.OrderID = serviceOrder.ServiceOrderID;
                            unitOfWork.GetRepository<DC_DispathTaskRecord>().Insert(taskDispatchRecord);
                        }
                        else
                        {
                            taskDispatchRecord.EmployeeID = response.Data.EmployeeId;
                            taskDispatchRecord.WorkTime = response.Data.AppointmentTime;
                            taskDispatchRecord.ClientName = response.Data.PersonName;
                            unitOfWork.GetRepository<DC_DispathTaskRecord>().Update(taskDispatchRecord);
                        }
                    }

                    unitOfWork.Save();
                }
            }

            return response;
        }

        public BaseResponse DeleteTask(int taskID)
        {
            return base.Delete<DC_Task>(taskID);
        }
        public BaseResponse<TaskRecordModel> ChangeTask(TaskRecordFilter filter)
        {
            var result = new BaseResponse<TaskRecordModel>();
            try
            {
                bool isAudit = false;
                unitOfWork.BeginTransaction();
                var TaskModel = base.Get<DC_Task, TaskModel>((q) => q.TaskID == filter.TaskID);
                if (TaskModel != null)
                {
                    //pc端管理员改签，直接审核通过
                    //app端如果改签时间超过了一天，则需要审核
                    TimeSpan? ts = filter.AppointmentTime - TaskModel.Data.AppointmentTime;
                    if (filter.IsAudit || (ts.HasValue && System.Math.Abs(ts.Value.TotalSeconds) <= 24 * 60 * 60))
                    {
                        isAudit = true;
                        TaskModel.Data.AppointmentTime = filter.AppointmentTime;
                        TaskModel.Data.IsChange = true;
                        base.Save<DC_Task, TaskModel>(TaskModel.Data, (q) => q.TaskID == filter.TaskID);

                        var taskDispatchRecord = unitOfWork.GetRepository<DC_DispathTaskRecord>().dbSet.Where(a => a.OrderID == TaskModel.Data.ServiceOrderID).FirstOrDefault();
                        if (taskDispatchRecord == null)
                        {
                            taskDispatchRecord = new DC_DispathTaskRecord();
                            taskDispatchRecord.EmployeeID = TaskModel.Data.EmployeeId;
                            taskDispatchRecord.WorkTime = TaskModel.Data.AppointmentTime;
                            taskDispatchRecord.ClientName = TaskModel.Data.PersonName;
                            taskDispatchRecord.OrderID = TaskModel.Data.ServiceOrderID;
                            unitOfWork.GetRepository<DC_DispathTaskRecord>().Insert(taskDispatchRecord);
                        }
                        else
                        {
                            taskDispatchRecord.EmployeeID = TaskModel.Data.EmployeeId;
                            taskDispatchRecord.WorkTime = TaskModel.Data.AppointmentTime;
                            taskDispatchRecord.ClientName = TaskModel.Data.PersonName;
                            unitOfWork.GetRepository<DC_DispathTaskRecord>().Update(taskDispatchRecord);
                        }
                    }

                    TaskRecordModel TaskRecordModel = new TaskRecordModel();
                    TaskRecordModel.ServiceTime = filter.AppointmentTime;
                    TaskRecordModel.ChangeTime = DateTime.Now;
                    TaskRecordModel.CreatedBy = 0;
                    TaskRecordModel.CreatedTime = DateTime.Now;
                    TaskRecordModel.IsAudit = isAudit;
                    TaskRecordModel.IsDeleted = false;
                    TaskRecordModel.ModifiedBy = 0;
                    TaskRecordModel.ModifiedTime = DateTime.Now;
                    TaskRecordModel.TaskID = filter.TaskID;
                    TaskRecordModel.Reason = filter.Result;
                    base.Save<DC_TaskChangeRecord, TaskRecordModel>(TaskRecordModel, (q) => false);
                    result.Data = TaskRecordModel;
                }
                unitOfWork.Commit();
                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ResultCode = 500;
                result.ResultMessage = ex.Message;
            }
            return result;
        }

        public BaseResponse AuditTask(TaskRecordFilter filter)
        {
            var result = new BaseResponse();
            try
            {
                unitOfWork.BeginTransaction();
                var TaskModel = base.Get<DC_Task, TaskModel>((q) => q.TaskID == filter.TaskID);
                var TaskRecordModel = base.Get<DC_TaskChangeRecord, TaskRecordModel>((q) => q.ID == filter.ID);
                if (TaskModel != null)
                {
                    if (filter.IsAudit)
                    {
                        TaskModel.Data.AppointmentTime = filter.AppointmentTime;
                        TaskModel.Data.IsChange = true;
                        base.Save<DC_Task, TaskModel>(TaskModel.Data, (q) => q.TaskID == filter.TaskID);
                        TaskRecordModel.Data.IsAudit = true;
                        TaskRecordModel.Data.ModifiedBy = 0;
                        TaskRecordModel.Data.ModifiedTime = DateTime.Now;
                        base.Save<DC_TaskChangeRecord, TaskRecordModel>(TaskRecordModel.Data, (q) => q.ID == filter.ID);
                    }
                }
                unitOfWork.Commit();
                result.IsSuccess = true;
            }
            catch (Exception ex)
            {
                result.IsSuccess = false;
                result.ResultCode = 500;
                result.ResultMessage = ex.Message;
            }
            return result;
        }

        public BaseResponse<IList<TaskRecordModel>> GetTaskRecord(BaseRequest<TaskFilter> request)
        {
            var response = base.Query<DC_TaskChangeRecord, TaskRecordModel>(request, (q) =>
            {
                if (request != null)
                {
                    if (request.Data.TaskID != 0)
                    {
                        q = q.Where(m => m.TaskID == request.Data.TaskID);
                    }
                }
                q = q.OrderByDescending(m => m.TaskID);
                return q;
            });
            return response;
        }
        /// <summary>
        /// 验证客户信息和当前任务工单是否是同一个人
        /// </summary>
        /// <returns></returns>
        public bool ValidationInformation(string name, string idcard, int taskid)
        {
            bool flag = false;
            var query = from t in unitOfWork.GetRepository<DC_Task>().dbSet
                        join p in unitOfWork.GetRepository<DC_Person>().dbSet
                         on t.PersonID equals p.PersonID
                        where t.TaskID == taskid && p.Name == name && p.IdCard == idcard
                        select new
                        {
                            t.TaskID
                        };
            var list = query.ToList();
            if (list != null && list.Count != 0)
            {
                flag = true;
            }
            return flag;
        }

        public BaseResponse<IList<DispatchModel>> GetDispatchTaskRecord(BaseRequest<DispatchTaskFilter> request)
        {
            BaseResponse<IList<DispatchModel>> response = new BaseResponse<IList<DispatchModel>>();
            var currentDate = request.Data.CurrentDate.Date;
            var finalDate = currentDate.AddDays(5);

            var dispatchTaskRecords = unitOfWork.GetRepository<DC_DispathTaskRecord>().dbSet.Where(m => m.WorkTime >= currentDate && m.WorkTime < finalDate).ToList();
            var emp = from m in unitOfWork.GetRepository<ORG_Employee>().dbSet.Where(a => a.EmpState == "001" && !a.IsDeleted)
                      select m;
            if (request.Data.OrganizationID != 0)
            {
                emp = emp.Where(m => m.OrganizationID == request.Data.OrganizationID);
            }

            if (!string.IsNullOrEmpty(request.Data.KeyWords))
            {
                emp = emp.Where(m => m.Tel.Contains(request.Data.KeyWords) || m.EmpName.Contains(request.Data.KeyWords));
            }

            if (!string.IsNullOrEmpty(request.Data.JobTitle))
            {
                emp = emp.Where(m => m.JobTitle == request.Data.JobTitle);
            }
            emp = emp.OrderByDescending(m => m.EmployeeID);
            response.RecordsCount = emp.Count();

            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<DispatchModel>();
                foreach (ORG_Employee item in list)
                {
                    var dispatch = new DispatchModel();
                    dispatch.EmployeeID = item.EmployeeID;
                    dispatch.EmpName = item.EmpName;
                    var dispathTaskList = new List<DispathTaskModel>();
                    for (var i = 0; i < 5;i++ )
                    {
                        var dispatchDate = new DispathTaskModel();
                        var fromDate = currentDate.AddDays(i);
                        var endDate = currentDate.AddDays(i + 1);
                        dispatchDate.WorkDate = fromDate;
                        dispatchDate.DispatchRecordList = new List<DispathTaskRecordModel>();

                        if (dispatchTaskRecords != null)
                        {
                            var empRecords = dispatchTaskRecords.Where(a => a.EmployeeID == item.EmployeeID && a.WorkTime >= fromDate && a.WorkTime < endDate).ToList();
                            if (empRecords!=null)
                            {
                                dispatchDate.DispatchRecordList = Mapper.DynamicMap<List<DispathTaskRecordModel>>(empRecords);
                            }
                        }
                        dispathTaskList.Add(dispatchDate);
                    }
                    dispatch.DispatchTaskList = dispathTaskList;
                    newList.Add(dispatch);
                }
                response.Data = newList;
            };

            if (request != null && request.PageSize > 0)
            {
                var list = emp.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = emp.ToList();
                mapperResponse(list);
            }
            return response;
        }

        public BaseResponse<IList<EvaluatedTaskModel>> GetEvaluatedTask(BaseRequest<TaskFilter> request)
        {
            var organizationId = request.Data.OrganizationID;
            var name = request.Data.Name??"";
            var response = new BaseResponse<IList<EvaluatedTaskModel>>();
            string finish = EnumHelper.GetDescription(Entity.TaskStatus.Finish);
            var q = from t in unitOfWork.GetRepository<DC_Task>()
                    .dbSet.Where(a => a.IsDeleted == false && a.IsCancel == false
                                      && a.Status == finish && a.OrganizationID == organizationId && a.EmployeeName.Contains(name))
                join e in unitOfWork.GetRepository<DC_Evaluation>().dbSet.Where(a => a.Mark != null && a.ServiceOrderID !=null)
                on t.ServiceOrderID equals e.ServiceOrderID 
                select new EvaluatedTaskModel()
                {
                    EmployeeId = t.EmployeeId,
                    EmployeeName = t.EmployeeName,
                    ServiceName = t.ServiceName,
                    TaskNO = t.TaskNo,
                    PersonName = t.PersonName,
                    Mark = e.Mark,
                    MarkTime = e.CreateTime,
                };


            response.RecordsCount = q.Count();

            if (request != null && request.PageSize > 0)
            {
                var list = q.OrderByDescending(a=>a.MarkTime).Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }

            else
            {
                response.Data = q.ToList();
            }
            return response;

        }

        #endregion
    }
}
