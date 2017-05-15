namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IWatchRecordService : IBaseService
    {
        #region DC_WatchRecord
        /// <summary>
        /// 获取DC_WatchRecord列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<WatchRecordModel>> QueryWatchRecord(BaseRequest<WatchRecordFilter> request);
        /// <summary>
        /// 获取DC_WatchRecord
        /// </summary>
        /// <param name="watchRecordID"></param>
        /// <returns></returns>
        BaseResponse<WatchRecordModel> GetWatchRecord(int watchRecordID);
        /// <summary>
        /// 保存DC_WatchRecord
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<WatchRecordModel> SaveWatchRecord(WatchRecordModel request);
        /// <summary>
        /// 删除DC_WatchRecord
        /// </summary>
        /// <param name="watchRecordID"></param>
        BaseResponse DeleteWatchRecord(int watchRecordID);
        #endregion
    }
}
