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
    
    public partial class MonitorItemService : BaseService, IMonitorItemService
    {
        #region DC_MonitorItem
        public BaseResponse<IList<MonitorItemModel>> QueryMonitorItem(BaseRequest<MonitorItemFilter> request)
        {
            var response = base.Query<DC_MonitorItem, MonitorItemModel>(request, (q) =>
            {
                if (request.Data.MonitoritemID != 0)
                {
                    q = q.Where(m => m.MonitoritemID == request.Data.MonitoritemID);
                }
                q = q.OrderByDescending(m => m.MonitoritemID);
                return q;
            });
            return response;
        }

        public BaseResponse<MonitorItemModel> GetMonitorItem(int monitoritemID)
        {
            return base.Get<DC_MonitorItem, MonitorItemModel>((q) => q.MonitoritemID == monitoritemID);
        }

        public BaseResponse<MonitorItemModel> SaveMonitorItem(MonitorItemModel request)
        {
            return base.Save<DC_MonitorItem, MonitorItemModel>(request, (q) => q.MonitoritemID == request.MonitoritemID);
        }

        public BaseResponse DeleteMonitorItem(int monitoritemID)
        {
            return base.Delete<DC_MonitorItem>(monitoritemID);
        }
        #endregion
    }
}
