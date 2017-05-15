namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IFamilyService : IBaseService
    {
        #region DC_Family
        /// <summary>
        /// 获取DC_Family列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<FamilyModel>> QueryFamily(BaseRequest<FamilyFilter> request);
        /// <summary>
        /// 获取DC_Family
        /// </summary>
        /// <param name="familyID"></param>
        /// <returns></returns>
        BaseResponse<FamilyModel> GetFamily(int familyID);
        /// <summary>
        /// 保存DC_Family
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<FamilyModel> SaveFamily(FamilyModel request);
        /// <summary>
        /// 删除DC_Family
        /// </summary>
        /// <param name="familyID"></param>
        BaseResponse DeleteFamily(int familyID);
        #endregion
    }
}
