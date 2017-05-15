namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IPriorityRemarkService : IBaseService
    {
        #region DC_PriorityRemark
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<PriorityRemarkModel>> QueryPriorityRemark(BaseRequest<PriorityRemarkFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="priorityRemarkID"></param>
        /// <returns></returns>
        BaseResponse<PriorityRemarkModel> GetPriorityRemark(int priorityRemarkID);
        /// <summary>
        /// 保存DC_PriorityRemark
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<PriorityRemarkModel> SavePriorityRemark(PriorityRemarkModel request);
        /// <summary>
        /// 删除DC_PriorityRemark
        /// </summary>
        /// <param name="priorityRemarkID"></param>
        BaseResponse DeletePriorityRemark(int priorityRemarkID);
        #endregion
    }
}
