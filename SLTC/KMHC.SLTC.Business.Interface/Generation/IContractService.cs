namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IContractService : IBaseService
    {
        #region DC_Contract
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ContractModel>> QueryContract(BaseRequest<ContractFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="contractID"></param>
        /// <returns></returns>
        BaseResponse<ContractModel> GetContract(int contractID);
        /// <summary>
        /// 保存DC_Contract
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ContractModel> SaveContract(ContractModel request);
        /// <summary>
        /// 删除DC_Contract
        /// </summary>
        /// <param name="contractID"></param>
        BaseResponse DeleteContract(int contractID);
        #endregion
    }
}
