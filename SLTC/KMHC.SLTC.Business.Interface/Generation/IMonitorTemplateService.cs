namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IMonitorTemplateService : IBaseService
    {
        #region DC_MonitorTemplate
        /// <summary>
        /// 获取DC_MonitorTemplate列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<MonitorTemplateModel>> QueryMonitorTemplate(BaseRequest<MonitorTemplateFilter> request);
        /// <summary>
        /// 获取DC_MonitorTemplate
        /// </summary>
        /// <param name="monitorTemplateID"></param>
        /// <returns></returns>
        BaseResponse<MonitorTemplateModel> GetMonitorTemplate(int monitorTemplateID);
        /// <summary>
        /// 保存DC_MonitorTemplate
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<MonitorTemplateModel> SaveMonitorTemplate(MonitorTemplateModel request);
        /// <summary>
        /// 删除DC_MonitorTemplate
        /// </summary>
        /// <param name="monitorTemplateID"></param>
        BaseResponse DeleteMonitorTemplate(int monitorTemplateID);
        #endregion
    }
}
