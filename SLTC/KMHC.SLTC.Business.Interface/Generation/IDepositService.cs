namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IDepositService : IBaseService
    {
        #region DC_Deposit
        /// <summary>
        /// 获取DC_Deposit列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DepositModel>> QueryDeposit(BaseRequest<DepositFilter> request);
        /// <summary>
        /// 获取DC_Deposit
        /// </summary>
        /// <param name="depositID"></param>
        /// <returns></returns>
        BaseResponse<DepositModel> GetDeposit(int depositID);
        /// <summary>
        /// 保存DC_Deposit
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<DepositModel> SaveDeposit(DepositModel request);
        /// <summary>
        /// 删除DC_Deposit
        /// </summary>
        /// <param name="depositID"></param>
        BaseResponse DeleteDeposit(int depositID);
        #endregion
    }
}
