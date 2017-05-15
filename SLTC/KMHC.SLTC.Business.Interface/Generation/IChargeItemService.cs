namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IChargeItemService : IBaseService
    {
        #region DC_ChargeItem
        /// <summary>
        /// 获取DC_ChargeItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ChargeItemModel>> QueryChargeItem(BaseRequest<ChargeItemFilter> request);
        /// <summary>
        /// 获取DC_ChargeItem
        /// </summary>
        /// <param name="chargeItemID"></param>
        /// <returns></returns>
        BaseResponse<ChargeItemModel> GetChargeItem(int chargeItemID);
        /// <summary>
        /// 保存DC_ChargeItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ChargeItemModel> SaveChargeItem(ChargeItemModel request);
        /// <summary>
        /// 删除DC_ChargeItem
        /// </summary>
        /// <param name="chargeItemID"></param>
        BaseResponse DeleteChargeItem(int chargeItemID);
        #endregion
    }
}
