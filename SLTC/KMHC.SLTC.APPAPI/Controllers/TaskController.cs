using KM.Common;
using KMHC.SLTC.APPAPI.Filters;
using KMHC.SLTC.APPAPI.Models.Input;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
    /// <summary>
    /// 
    /// </summary>
    [RoutePrefix("api/Phone")]
    //[JWTAuthentication]
    public class TaskController : ApiController
    {
        ITaskService service = IOCContainer.Instance.Resolve<ITaskService>();
        IServiceOrderService orderService = IOCContainer.Instance.Resolve<IServiceOrderService>();

        /// <summary>
        ///  获取任务列表
        /// </summary>
        /// <param name="input">输入参数</param>
        /// <returns>返回任务列表</returns>
        [Route("QueryMyTaskList")]
        [HttpPost]
        public IHttpActionResult GetMyTaskList(GetMyTaskListInput input)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                CurrentPage = input.CurrentPage,
                PageSize = input.PageSize,
                Data = new TaskFilter() { EmployeeId = input.EmployeeId, OrganizationID = input.OrganizationID, type = 1,
                    Status = input.Status
                ,AppointmentTimeStart=input.AppointmentTimeStart,AppointmentTimeEnd=input.AppointmentTimeEnd
                ,IsCancel=input.IsCancel,IsChange=input.IsChange,Keywords=input.Keywords,HasChange=input.HasChange}

            };
            var response = service.QueryTask(request);
            return Ok(response);
        }
        /// <summary>
        /// 查询该会员做过的服务项目
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [Route("QueryResidentServicedList")]
        [HttpPost]
        public IHttpActionResult QueryResidentServicedList(GetResidentServicedInput input)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                CurrentPage = input.CurrentPage,
                PageSize = input.PageSize,
                Data = new TaskFilter()
                {
                    PersonID = input.PersonID,
                    EmployeeId = input.EmployeeId,
                   Status = new string[] { "Finish" },
                   OrganizationID=input.OrganizationID
                }

            };
            var response = service.QueryTask(request);
            return Ok(response);
        }
        /// <summary>
        /// 获取任务信息
        /// </summary>
        /// <param name="TaskId">任务id</param>
        /// <returns></returns>
        [Route("GetMyTaskInfo"), HttpGet]
        public IHttpActionResult GetMyTaskList(int TaskId)
        {
            var response = service.GetTaskInfo(TaskId);
            return Ok(response);
        }

        /// <summary>
        /// 任务签到
        /// </summary>
        /// <param name="input">签到参数</param>
        /// <returns>ture 签到成功，false 签到失败</returns>
        [Route("BeginTask")]
        [HttpPost]
        public IHttpActionResult BeginTask(BeginTaskInput input)
        {
            BaseSimpleResponse<bool> result = new BaseSimpleResponse<bool>();
            bool flag = false;
             var Isvalida = service.ValidationInformation(input.Name, input.IdCard, input.TaskId);
             if (Isvalida)
             {
                 var BRModel = service.GetTask(input.TaskId);
                 if (BRModel != null && BRModel.Data != null)
                 {
                     var model = BRModel.Data;
                     model.BeginTime = DateTime.Now;
                     model.Status = "Execution";
                     model.StartLng = input.StartLng;
                     model.StartLat = input.StartLat;
                     var response = service.SaveTask(model);
                     flag = response.IsSuccess;
                     result.Data = flag;
                     result.ResultMessage = response.ResultMessage;
                     result.IsSuccess = flag;
                 }
             }
             else
             {
                 result.Data = flag;
                 result.ResultMessage = "客户信息和工单需服务人员不匹配";
                 result.IsSuccess = flag;
             }
            return Ok(result);
        }

        /// <summary>
        ///  任务结束
        /// </summary>
        /// <param name="input">结束参数</param>
        /// <returns>ture 结束成功，false 结束失败</returns>
        [Route("FinishTask")]
        [HttpPost]
        public IHttpActionResult FinishTask(FinishTaskInput input)
        {
            BaseResponse<bool> result = new BaseResponse<bool>();
            bool flag = false;
            var Isvalida = service.ValidationInformation(input.Name, input.IdCard, input.TaskId);
            if (Isvalida)
            {
                var BRModel = service.GetTask(input.TaskId);
                if (BRModel != null && BRModel.Data != null)
                {
                    var model = BRModel.Data;
                    model.EndTime = DateTime.Now;
                    model.Status = "Finish";
                    model.EndLng = input.EndLng;
                    model.EndLat = input.EndLat;
                    var response = service.SaveTask(model);
                    flag = response.IsSuccess;
                    result.Data = flag;
                    result.ResultMessage = response.ResultMessage;
                    result.IsSuccess = flag;
                }
            }
            else
            {
                result.Data = flag;
                result.ResultMessage = "客户信息和工单需服务人员不匹配";
                result.IsSuccess = flag;
            }
            return Ok(result);
        }
        /// <summary>
        /// 改签
        /// </summary>
        /// <param name="TaskID"></param>
        /// <param name="Input"></param>
        /// <returns></returns>
        [Route("ChangeTask")]
        [HttpPut]
        public IHttpActionResult ChangeTask(int TaskID, [FromBody]ChangeTaskInput Input)
        {
            TaskRecordFilter filter = new TaskRecordFilter()
            {
                TaskID = TaskID,
                AppointmentTime = Input.AppointmentTime,
                Result = Input.Result
            };
            var response = service.ChangeTask(filter);
            return Ok(response);
        }
        /// <summary>
        /// 获取改签记录的详细内容,传入TaskID=5有数据
        /// </summary>
        /// <param name="TaskID">任务ID</param>
        /// <returns></returns>
        [Route("GetTaskRecord")]
        [HttpGet]
        public IHttpActionResult GetTaskRecord(int TaskID)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
               
                Data = new TaskFilter()
                {
                   TaskID=TaskID
                }

            };
            var response = service.GetTaskRecord(request);
            return Ok(response);
        }
        /// <summary>
        /// 获取今天工单任务数和所有已完成工单任务数，传入数据格式类似{"EmployeeId":34,"OrganizationID":1}
        /// EmployeeId就是登录信息中的工号EmpId
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [Route("GetTaskNumber")]
        [HttpPost]
        public IHttpActionResult GetTaskNumber(GetTaskNumberInput input)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
               
                Data = new TaskFilter()
                {
                    EmployeeId = input.EmployeeId,
                    OrganizationID = input.OrganizationID, 
                }

            };
            var response = service.GetTaskNumber(request);
            return Ok(response);
        }
        /// <summary>
        /// 获取我的绩效，传入数据格式{"EmployeeId":34,"CurrentPage":1,"PageSize":15,"OrganizationID":1,"EndTimeStart":"2016-09-20 00:00:00","EndTimeEnd":"2016-10-30 23:59:59","Status":["Finish"]}，EmployeeId就是登录信息中的工号EmpId
        /// </summary>
        /// <param name="input"></param>
        /// <returns></returns>
        [Route("GetMyPerformance")]
        [HttpPost]
        public IHttpActionResult GetMyPerformance(GetMyPerformanceInput input)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                CurrentPage = input.CurrentPage,
                PageSize = input.PageSize,
                Data = new TaskFilter()
                {
                    EmployeeId = input.EmployeeId,
                    OrganizationID = input.OrganizationID,
                    type = 1,
                    Status = input.Status
                    ,
                    EndTimeStart = input.EndTimeStart,
                    EndTimeEnd = input.EndTimeEnd
                }

            };
            var response = service.GetMyPerformance(request);
            return Ok(response);
        }
    }
}