namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IBedService : IBaseService
    {
        #region ORG_Bed
        /// <summary>
        /// 获取ORG_Bed列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<BedModel>> QueryBed(BaseRequest<BedFilter> request);
        /// <summary>
        /// 获取ORG_Bed
        /// </summary>
        /// <param name="bedID"></param>
        /// <returns></returns>
        BaseResponse<BedModel> GetBed(int bedID);
        /// <summary>
        /// 保存ORG_Bed
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<BedModel> SaveBed(BedModel request);
        /// <summary>
        /// 删除ORG_Bed
        /// </summary>
        /// <param name="bedID"></param>
        BaseResponse DeleteBed(int bedID);
        #endregion
    }
}
