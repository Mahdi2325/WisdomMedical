using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.Phone
{
    [RoutePrefix("api/Phone")]
    public class MyPhoneController : BaseApiController
    {
        ITaskService service = IOCContainer.Instance.Resolve<ITaskService>();

        /// <summary>
        /// 获取任务列表
        /// </summary>
        /// <param name="EmployeeId">员工编号</param>
        /// <param name="CurrentPage">当前页</param>
        /// <param name="PageSize">一页多少行</param>
        /// <returns></returns>
        [Route("QueryMyTaskList"), HttpGet]
        public IHttpActionResult GetMyTaskList(int EmployeeId, int CurrentPage = 1, int PageSize = 10)
        {
            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                CurrentPage = CurrentPage,
                PageSize = PageSize,
                Data = new TaskFilter() { EmployeeId = EmployeeId, OrganizationID = 0, type = 1, Status = new string[] { "Assign", "Execution" } }

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
            var response = service.GetTask(TaskId);
            return Ok(response);
        }

        /// <summary>
        /// 任务开始 签到
        /// </summary>
        /// <param name="TaskId">任务编号</param>
        /// <param name="EndLng">经度</param>
        /// <param name="EndLat">维度</param>
        /// <returns></returns>
        [Route("BeginTask"), HttpGet]
        public IHttpActionResult BeginTask(int TaskId, float StartLng, float StartLat)
        {
            bool flag = false;
            var BRModel = service.GetTask(TaskId);
            if (BRModel != null && BRModel.Data != null)
            {
                var model = BRModel.Data;
                model.BeginTime = DateTime.Now;
                model.Status = "Execution";
                model.StartLng = StartLng;
                model.StartLat = StartLat;
                var response = service.SaveTask(model);
                flag = response.IsSuccess;
            }
            return Ok(flag);
        }

        /// <summary>
        /// 任务结束
        /// </summary>
        /// <param name="TaskId">任务编号</param>
        /// <param name="EndLng">经度</param>
        /// <param name="EndLat">维度</param>
        /// <returns></returns>
        [Route("FinishTask"), HttpGet]       
        public IHttpActionResult FinishTask(int TaskId, float EndLng, float EndLat)
        {
            bool flag = false;
            var BRModel = service.GetTask(TaskId);
            if (BRModel != null && BRModel.Data != null)
            {
                var model = BRModel.Data;
                model.EndTime = DateTime.Now;
                model.Status = "Finish";
                model.EndLng = EndLng;
                model.EndLat = EndLat;
                var response = service.SaveTask(model);
                flag = response.IsSuccess;
            }
            return Ok(flag);
        }

    }
}
