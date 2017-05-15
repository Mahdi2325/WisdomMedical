namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface ICallInfoService : IBaseService
    {
        #region DC_CallInfo
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<CallInfoModel>> QueryCallInfo(BaseRequest<CallInfoFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="callInfoID"></param>
        /// <returns></returns>
        BaseResponse<CallInfoModel> GetCallInfo(int callInfoID);
        /// <summary>
        /// 保存DC_CallInfo
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<CallInfoModel> SaveCallInfo(CallInfoModel request);
        /// <summary>
        /// 删除DC_CallInfo
        /// </summary>
        /// <param name="callInfoID"></param>
        BaseResponse DeleteCallInfo(int callInfoID);
        #endregion
    }
}
