namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface ICommodityTypeService : IBaseService
    {
        #region DC_CommodityType
        /// <summary>
        /// 获取DC_ServiceItemCategory列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<CommodityTypeModel>> QueryCommodityType(BaseRequest<CommodityTypeFilter> request);
        /// <summary>
        /// 获取DC_ServiceItemCategory
        /// </summary>
        /// <param name="serviceItemCategoryID"></param>
        /// <returns></returns>
        BaseResponse<CommodityTypeModel> GetCommodityType(int commodityTypeID);
        /// <summary>
        /// 保存DC_ServiceItemCategory
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<CommodityTypeModel> SaveCommodityType(CommodityTypeModel request);
        /// <summary>
        /// 删除DC_ServiceItemCategory
        /// </summary>
        /// <param name="commodityTypeID"></param>
        BaseResponse DeleteCommodityType(int commodityTypeID);
        #endregion
    }
}
