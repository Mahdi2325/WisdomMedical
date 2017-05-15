namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IFeeDetailService : IBaseService
    {
        #region DC_FeeDetail
        /// <summary>
        /// 获取DC_FeeDetail列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<FeeDetailModel>> QueryFeeDetail(BaseRequest<FeeDetailFilter> request);
        /// <summary>
        /// 获取DC_FeeDetail
        /// </summary>
        /// <param name="feeDetailID"></param>
        /// <returns></returns>
        BaseResponse<FeeDetailModel> GetFeeDetail(int feeDetailID);
        /// <summary>
        /// 保存DC_FeeDetail
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<FeeDetailModel> SaveFeeDetail(FeeDetailModel request);
        /// <summary>
        /// 删除DC_FeeDetail
        /// </summary>
        /// <param name="feeDetailID"></param>
        BaseResponse DeleteFeeDetail(int feeDetailID);
        #endregion
    }
}
