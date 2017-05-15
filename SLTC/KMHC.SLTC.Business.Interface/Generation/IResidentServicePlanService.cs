namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IResidentServicePlanService : IBaseService
    {
        #region DC_ResidentServicePlan
        /// <summary>
        /// 获取DC_ResidentServicePlan列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ResidentServicePlanModel>> QueryResidentServicePlan(BaseRequest<ResidentServicePlanFilter> request);
        /// <summary>
        /// 获取DC_ResidentServicePlan
        /// </summary>
        /// <param name="residentServicePlanID"></param>
        /// <returns></returns>
        BaseResponse<ResidentServicePlanModel> GetResidentServicePlan(int residentServicePlanID);
        /// <summary>
        /// 保存DC_ResidentServicePlan
        /// </summary>
        /// <param name="request"></param>
        BaseResponse SaveResidentServicePlan(ServiceGroupOrderModel request);
        /// <summary>
        /// 删除DC_ResidentServicePlan
        /// </summary>
        /// <param name="residentServicePlanID"></param>
        BaseResponse DeleteResidentServicePlan(int residentServicePlanID);
        #endregion
    }
}
