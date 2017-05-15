namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IDeptService : IBaseService
    {
        #region ORG_Dept
        /// <summary>
        /// 获取ORG_Dept列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DeptModel>> QueryDept(BaseRequest<DeptFilter> request);
        /// <summary>
        /// 获取ORG_Dept
        /// </summary>
        /// <param name="DeptID"></param>
        /// <returns></returns>
        BaseResponse<DeptModel> GetDept(int DeptID);
        /// <summary>
        /// 保存ORG_Dept
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<DeptModel> SaveDept(DeptModel request);
        /// <summary>
        /// 删除ORG_Dept
        /// </summary>
        /// <param name="DeptID"></param>
        BaseResponse DeleteDept(int DeptID);
        #endregion
    }
}
