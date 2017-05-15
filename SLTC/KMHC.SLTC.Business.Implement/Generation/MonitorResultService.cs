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
    using System.Collections.Generic;
    using System.Linq;
    
    public partial class MonitorResultService : BaseService, IMonitorResultService
    {
        #region DC_MonitorResult
        public BaseResponse<IList<MonitorResultModel>> QueryMonitorResult(BaseRequest<MonitorResultFilter> request)
        {
            var response = base.Query<DC_MonitorResult, MonitorResultModel>(request, (q) =>
            {
                if (request.Data.MonitorResultID != 0)
                {
                    q = q.Where(m => m.MonitorResultID == request.Data.MonitorResultID);
                }
                q = q.OrderBy(m => m.MonitorResultID);
                return q;
            });
            return response;
        }

        public BaseResponse<MonitorResultModel> GetMonitorResult(int monitorResultID)
        {
            return base.Get<DC_MonitorResult, MonitorResultModel>((q) => q.MonitorResultID == monitorResultID);
        }

        public BaseResponse<MonitorResultModel> SaveMonitorResult(MonitorResultModel request)
        {
            return base.Save<DC_MonitorResult, MonitorResultModel>(request, (q) => q.MonitorResultID == request.MonitorResultID);
        }

        public BaseResponse DeleteMonitorResult(int monitorResultID)
        {
            return base.Delete<DC_MonitorResult>(monitorResultID);
        }
        #endregion
    }
}
