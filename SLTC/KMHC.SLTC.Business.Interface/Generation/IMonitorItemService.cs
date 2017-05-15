namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IMonitorItemService : IBaseService
    {
        #region DC_MonitorItem
        /// <summary>
        /// 获取DC_MonitorItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<MonitorItemModel>> QueryMonitorItem(BaseRequest<MonitorItemFilter> request);
        /// <summary>
        /// 获取DC_MonitorItem
        /// </summary>
        /// <param name="monitoritemID"></param>
        /// <returns></returns>
        BaseResponse<MonitorItemModel> GetMonitorItem(int monitoritemID);
        /// <summary>
        /// 保存DC_MonitorItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<MonitorItemModel> SaveMonitorItem(MonitorItemModel request);
        /// <summary>
        /// 删除DC_MonitorItem
        /// </summary>
        /// <param name="monitoritemID"></param>
        BaseResponse DeleteMonitorItem(int monitoritemID);
        #endregion
    }
}
