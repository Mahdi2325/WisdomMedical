namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IAreaService : IBaseService
    {
        #region ORG_Area
        /// <summary>
        /// 获取ORG_Area列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<AreaModel>> QueryArea(BaseRequest<AreaFilter> request);
        /// <summary>
        /// 获取ORG_Area
        /// </summary>
        /// <param name="areaID"></param>
        /// <returns></returns>
        BaseResponse<AreaModel> GetArea(int areaID);
        /// <summary>
        /// 保存ORG_Area
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<AreaModel> SaveArea(AreaModel request);
        /// <summary>
        /// 删除ORG_Area
        /// </summary>
        /// <param name="areaID"></param>
        BaseResponse DeleteArea(int areaID);
        #endregion
    }
}
