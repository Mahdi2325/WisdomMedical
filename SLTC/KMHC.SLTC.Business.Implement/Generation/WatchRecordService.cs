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
    
    public partial class WatchRecordService : BaseService, IWatchRecordService
    {
        #region DC_WatchRecord
        public BaseResponse<IList<WatchRecordModel>> QueryWatchRecord(BaseRequest<WatchRecordFilter> request)
        {
            var response = base.Query<DC_WatchRecord, WatchRecordModel>(request, (q) =>
            {
                if (request.Data.WatchRecordID != 0)
                {
                    q = q.Where(m => m.WatchRecordID == request.Data.WatchRecordID);
                }
                q = q.OrderBy(m => m.WatchRecordID);
                return q;
            });
            return response;
        }

        public BaseResponse<WatchRecordModel> GetWatchRecord(int watchRecordID)
        {
            return base.Get<DC_WatchRecord, WatchRecordModel>((q) => q.WatchRecordID == watchRecordID);
        }

        public BaseResponse<WatchRecordModel> SaveWatchRecord(WatchRecordModel request)
        {
            return base.Save<DC_WatchRecord, WatchRecordModel>(request, (q) => q.WatchRecordID == request.WatchRecordID);
        }

        public BaseResponse DeleteWatchRecord(int watchRecordID)
        {
            return base.Delete<DC_WatchRecord>(watchRecordID);
        }
        #endregion
    }
}
