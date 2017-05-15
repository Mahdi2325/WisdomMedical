namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IServiceItemService : IBaseService
    {
        #region DC_ServiceItem
        /// <summary>
        /// 获取DC_ServiceItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceItemModel>> QueryServiceItem(BaseRequest<ServiceItemFilter> request);
        BaseResponse<IList<ServiceItemModel>> QueryServiceItemWithServicePlan(BaseRequest<ServiceItemFilter> request);
         /// <summary>
        /// 获取所有分类及服务项目列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceItemCategoryModel>> QueryServiceCategoryAndItem(int OrganizationID);
        /// <summary>
        /// 获取DC_ServiceItem
        /// </summary>
        /// <param name="serviceItemID"></param>
        /// <returns></returns>
        BaseResponse<ServiceItemModel> GetServiceItem(int serviceItemID);
        /// <summary>
        /// 保存DC_ServiceItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ServiceItemModel> SaveServiceItem(ServiceItemModel request);
        /// <summary>
        /// 删除DC_ServiceItem
        /// </summary>
        /// <param name="serviceItemID"></param>
        BaseResponse DeleteServiceItem(int serviceItemID);
        /// <summary>
        /// 获取所有分类及服务项目列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceItemModel>> QueryHotServiceItem(int organizationID,int fechCnt);
        #endregion
    }
}
