namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IMonitorResultService : IBaseService
    {
        #region DC_MonitorResult
        /// <summary>
        /// 获取DC_MonitorResult列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<MonitorResultModel>> QueryMonitorResult(BaseRequest<MonitorResultFilter> request);
        /// <summary>
        /// 获取DC_MonitorResult
        /// </summary>
        /// <param name="monitorResultID"></param>
        /// <returns></returns>
        BaseResponse<MonitorResultModel> GetMonitorResult(int monitorResultID);
        /// <summary>
        /// 保存DC_MonitorResult
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<MonitorResultModel> SaveMonitorResult(MonitorResultModel request);
        /// <summary>
        /// 删除DC_MonitorResult
        /// </summary>
        /// <param name="monitorResultID"></param>
        BaseResponse DeleteMonitorResult(int monitorResultID);
        #endregion
    }
}
