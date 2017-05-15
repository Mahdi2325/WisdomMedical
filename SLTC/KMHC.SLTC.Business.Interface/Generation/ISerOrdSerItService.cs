namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface ISerOrdSerItService : IBaseService
    {
        #region DC_SerOrdSerIt
        /// <summary>
        /// 获取DC_SerOrdSerIt列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<SerOrdSerItModel>> QuerySerOrdSerIt(BaseRequest<SerOrdSerItFilter> request);
        /// <summary>
        /// 获取DC_SerOrdSerIt
        /// </summary>
        /// <param name="serviceOrderSIID"></param>
        /// <returns></returns>
        BaseResponse<SerOrdSerItModel> GetSerOrdSerIt(int serviceOrderSIID);
        /// <summary>
        /// 保存DC_SerOrdSerIt
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<SerOrdSerItModel> SaveSerOrdSerIt(SerOrdSerItModel request);
        /// <summary>
        /// 删除DC_SerOrdSerIt
        /// </summary>
        /// <param name="serviceOrderSIID"></param>
        BaseResponse DeleteSerOrdSerIt(int serviceOrderSIID);
        #endregion
    }
}
