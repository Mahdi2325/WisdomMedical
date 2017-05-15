namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface ITaskService : IBaseService
    {
        #region DC_Task
        /// <summary>
        /// 获取DC_Task列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<TaskModel>> QueryTask(BaseRequest<TaskFilter> request);
        BaseResponse<PerformanceModel> GetMyPerformance(BaseRequest<TaskFilter> request);
        /// <summary>
        /// 获取DC_Task
        /// </summary>
        /// <param name="taskID"></param>
        /// <returns></returns>
        BaseResponse<TaskModel> GetTask(int taskID);
        /// <summary>
        /// 获取工单详情
        /// </summary>
        /// <param name="taskID"></param>
        /// <returns></returns>
        BaseResponse<TaskModel> GetTaskInfo(int taskID);
        BaseResponse<TaskNumber> GetTaskNumber(BaseRequest<TaskFilter> request);
        /// <summary>
        /// 保存DC_Task
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<TaskModel> SaveTask(TaskModel request);
        /// <summary>
        /// 删除DC_Task
        /// </summary>
        /// <param name="taskID"></param>
        BaseResponse DeleteTask(int taskID);
        /// <summary>
        /// 改签
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        BaseResponse<TaskRecordModel> ChangeTask(TaskRecordFilter filter);
        /// <summary>
        /// 审核改签
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        BaseResponse AuditTask(TaskRecordFilter filter);
        /// <summary>
        /// 获取改签记录
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<TaskRecordModel>> GetTaskRecord(BaseRequest<TaskFilter> request);
        /// <summary>
        /// 验证客户信息和当前任务工单是否是同一个人
        /// </summary>
        /// <returns></returns>
        bool ValidationInformation(string name, string idcard, int taskid);
        /// <summary>
        /// 获取服务人员排班安排
        /// </summary>
        /// <returns></returns>
        BaseResponse<IList<DispatchModel>> GetDispatchTaskRecord(BaseRequest<DispatchTaskFilter> request);

       /// <summary>
        /// 获取已经评分的工单
       /// </summary>
       /// <param name="request"></param>
       /// <returns></returns>
        BaseResponse<IList<EvaluatedTaskModel>> GetEvaluatedTask(BaseRequest<TaskFilter> request);

        #endregion
    }
}
