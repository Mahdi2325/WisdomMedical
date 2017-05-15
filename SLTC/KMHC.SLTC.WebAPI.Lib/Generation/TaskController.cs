namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.Infrastructure;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.WebAPI.Lib.Attribute;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/task"), RoleBaseAuthorize]
    public class TaskController : BaseApiController
    {
        ITaskService service = IOCContainer.Instance.Resolve<ITaskService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<TaskFilter> request)
        {
            var response = service.QueryTask(request);
            return Ok(response);
        }

        [Route("{taskID}")]
        public IHttpActionResult Get(int taskID)
        {
            var response = service.GetTask(taskID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(TaskModel baseRequest)
        {
            var response = service.SaveTask(baseRequest);
            return Ok(response);
        }

        [Route("{taskID}")]
        public IHttpActionResult Delete(int taskID)
        {
            var response = service.DeleteTask(taskID);
            return Ok(response);
        }

        /// <summary>
        /// 改签
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        [Route("ChangeTask")]
        [HttpPost]
        public IHttpActionResult ChangeTask([FromBody]TaskRecordFilter Input)
        {
            var response = service.ChangeTask(Input);
            return Ok(response);
        }

        /// <summary>
        /// 审核改签
        /// </summary>
        /// <param name="Input"></param>
        /// <returns></returns>
        [Route("AuditTask")]
        [HttpPost]
        public IHttpActionResult AuditTask([FromBody]TaskRecordFilter Input)
        {
            var response = service.AuditTask(Input);
            return Ok(response);
        }

        /// <summary>
        /// 获取改签信息
        /// </summary>
        /// <param name="TaskID"></param>
        /// <returns></returns>
        [Route("GetTaskChange")]
        [HttpGet]
        public IHttpActionResult GetTaskChange(int TaskID)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                Data = new TaskFilter()
                {
                    TaskID = TaskID
                }

            };

            var response = service.GetTaskRecord(request);

            var data = response.Data;
            if (data!=null && data.Count !=0)
            {
                var q = data.Where(a => !a.IsAudit.Value);
                response.Data = q.ToList();
            }

            return Ok(response);
        }

        [Route("Monitor"), HttpGet]
        public IHttpActionResult MonitorTaskData()
        {
            var response = new BaseResponse<object>();
            var nowTime = DateTime.Now;
            var minTime = nowTime.Date;
            var maxTime = minTime.AddHours(24).AddSeconds(-1);
            var taskResponse = service.QueryTask(new BaseRequest<TaskFilter>()
            {
                Data =
                {
                    OrganizationID = SecurityHelper.CurrentPrincipal.OrgId,
                    AppointmentTimeStart = minTime,
                    AppointmentTimeEnd = maxTime
                }
            });
            var allTaskResponse = service.QueryTask(new BaseRequest<TaskFilter>()
            {
                Data =
                {
                    OrganizationID = SecurityHelper.CurrentPrincipal.OrgId,
                    Status = new string[] { Enum.GetName(typeof(TaskStatus), TaskStatus.Finish) }
                }
            });
            var lastFinishTask = taskResponse.Data.Where(it=> it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish)).OrderByDescending(it => it.EndTime).FirstOrDefault();
            response.Data = new
            {
                Residents = taskResponse.Data.GroupBy(it => new { it.PersonID, it.PersonName }).Select(it => new { 
                    it.Key.PersonID, 
                    it.Key.PersonName, 
                    ResidentServiceStatus = !it.Any(sub=>sub.Status != Enum.GetName(typeof(TaskStatus), TaskStatus.Finish))  
                }).ToList(),
                ServiceList = taskResponse.Data.Where(it => !string.IsNullOrEmpty(it.EmployeeName)).GroupBy(it => new { it.EmployeeId, it.EmployeeName }).Select(it => new
                {
                    it.Key.EmployeeId,
                    it.Key.EmployeeName,
                    ServiceStatus = it.Any(sub => sub.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Execution)) ? "正在服务" : "空闲",
                    CompleteTotal = it.Count(sub => sub.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish)),
                    UnCompleteTotal = it.Count(sub => sub.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Assign) || sub.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Execution)),
                }).ToList(),
                RemindList = taskResponse.Data
                .Where(it => (it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Wait) || it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Assign)))
                .OrderBy(it => it.AppointmentTime).Select(it => new
                {
                    ServiceOrderID = it.ServiceOrderID,
                    Otime = it.AppointmentTime,
                    SIType = it.ServiceType,
                    SIName = it.ServiceName,
                    PersonName = it.PersonName,
                    EmployeeName = string.IsNullOrEmpty(it.EmployeeName) ? "没有分配" : it.EmployeeName,
                    IsRemind = nowTime.CompareTo(it.AppointmentTime) > 0
                }).Take(4).ToList(),
                //TodayCompleteTotal = taskResponse.Data.Where(it=>it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish)).GroupBy(it => new { it.PersonID }).Count(),
                TodayCompleteTotal = taskResponse.Data.Where(it => it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Finish)).Count(),
                ExecutionTotal = taskResponse.Data.Where(it => it.Status == Enum.GetName(typeof(TaskStatus), TaskStatus.Execution)).Count(),
                CompleteTotal = allTaskResponse.RecordsCount,
                Message = lastFinishTask != null ? string.Format("{0} {1} 护理员完成{2}服务", lastFinishTask.EndTime, lastFinishTask.EmployeeName, lastFinishTask.ServiceName) : ""
            };
            return Ok(response);
        }

        [Route("GetDispatchTaskRecord"), HttpGet]
        public IHttpActionResult GetDispatchTaskRecord([FromUri]BaseRequest<DispatchTaskFilter> request)
        {
            var response = service.GetDispatchTaskRecord(request);
            return Ok(response);
        }

        [Route("GetEvaluatedTask")]
        public IHttpActionResult GetEvaluatedTask([FromUri]BaseRequest<TaskFilter> request)
        {
            var response = service.GetEvaluatedTask(request);
            return Ok(response);
        }
    }
}
