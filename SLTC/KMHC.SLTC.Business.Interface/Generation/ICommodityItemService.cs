namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface ICommodityItemService : IBaseService
    {
        #region DC_ChargeItem
        /// <summary>
        /// 获取DC_ChargeItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<CommodityItemModel>> QueryCommodityItem(BaseRequest<CommodityItemFilter> request);
        /// <summary>
        /// 获取DC_ChargeItem
        /// </summary>
        /// <param name="chargeItemID"></param>
        /// <returns></returns>
        BaseResponse<CommodityItemModel> GetCommodityItem(int commodityItemID);
        /// <summary>
        /// 保存DC_ChargeItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<CommodityItemModel> SaveCommodityItem(CommodityItemModel request);
        /// <summary>
        /// 删除DC_ChargeItem
        /// </summary>
        /// <param name="chargeItemID"></param>
        BaseResponse DeleteCommodityItem(int commodityItemID);
        #endregion
    }
}
