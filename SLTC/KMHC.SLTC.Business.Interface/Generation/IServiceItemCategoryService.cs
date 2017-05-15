namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IServiceItemCategoryService : IBaseService
    {
        #region DC_ServiceItemCategory
        /// <summary>
        /// 获取DC_ServiceItemCategory列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceItemCategoryModel>> QueryServiceItemCategory(BaseRequest<ServiceItemCategoryFilter> request);
        /// <summary>
        /// 获取DC_ServiceItemCategory
        /// </summary>
        /// <param name="serviceItemCategoryID"></param>
        /// <returns></returns>
        BaseResponse<ServiceItemCategoryModel> GetServiceItemCategory(int serviceItemCategoryID);
        /// <summary>
        /// 保存DC_ServiceItemCategory
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ServiceItemCategoryModel> SaveServiceItemCategory(ServiceItemCategoryModel request);
        /// <summary>
        /// 删除DC_ServiceItemCategory
        /// </summary>
        /// <param name="serviceItemCategoryID"></param>
        BaseResponse DeleteServiceItemCategory(int serviceItemCategoryID);
        #endregion
    }
}
