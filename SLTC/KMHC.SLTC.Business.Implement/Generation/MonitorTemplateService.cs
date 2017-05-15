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
    
    public partial class MonitorTemplateService : BaseService, IMonitorTemplateService
    {
        #region DC_MonitorTemplate
        public BaseResponse<IList<MonitorTemplateModel>> QueryMonitorTemplate(BaseRequest<MonitorTemplateFilter> request)
        {
            var response = base.Query<DC_MonitorTemplate, MonitorTemplateModel>(request, (q) =>
            {
                if (request.Data.MonitorTemplateID != 0)
                {
                    q = q.Where(m => m.MonitorTemplateID == request.Data.MonitorTemplateID);
                }
                q = q.OrderBy(m => m.MonitorTemplateID);
                return q;
            });
            return response;
        }

        public BaseResponse<MonitorTemplateModel> GetMonitorTemplate(int monitorTemplateID)
        {
            return base.Get<DC_MonitorTemplate, MonitorTemplateModel>((q) => q.MonitorTemplateID == monitorTemplateID);
        }

        public BaseResponse<MonitorTemplateModel> SaveMonitorTemplate(MonitorTemplateModel request)
        {
            return base.Save<DC_MonitorTemplate, MonitorTemplateModel>(request, (q) => q.MonitorTemplateID == request.MonitorTemplateID);
        }

        public BaseResponse DeleteMonitorTemplate(int monitorTemplateID)
        {
            return base.Delete<DC_MonitorTemplate>(monitorTemplateID);
        }
        #endregion
    }
}
