namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IResidentServicePlanItemService : IBaseService
    {
        #region DC_ResidentServicePlanItem
        /// <summary>
        /// 获取DC_ResidentServicePlanItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ResidentServicePlanItemModel>> QueryResidentServicePlanItem(BaseRequest<ResidentServicePlanItemFilter> request);
        /// <summary>
        /// 获取DC_ResidentServicePlanItem
        /// </summary>
        /// <param name="residentServicePlanItemID"></param>
        /// <returns></returns>
        BaseResponse<ResidentServicePlanItemModel> GetResidentServicePlanItem(int residentServicePlanItemID);
        /// <summary>
        /// 保存DC_ResidentServicePlanItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ResidentServicePlanItemModel> SaveResidentServicePlanItem(ResidentServicePlanItemModel request);
        /// <summary>
        /// 删除DC_ResidentServicePlanItem
        /// </summary>
        /// <param name="residentServicePlanItemID"></param>
        BaseResponse DeleteResidentServicePlanItem(int residentServicePlanItemID);
        #endregion
    }
}
