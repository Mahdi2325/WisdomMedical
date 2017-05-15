namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IResidentAddressService : IBaseService
    {
        #region DC_ResidentAddress
        /// <summary>
        /// 获取DC_ResidentAddress列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ResidentAddressModel>> QueryResidentAddress(int residentID);
        /// <summary>
        /// 获取DC_ResidentAddress
        /// </summary>
        /// <param name="addressID"></param>
        /// <returns></returns>
        BaseResponse<ResidentAddressModel> GetResidentAddress(int addressID);
        /// <summary>
        /// 保存DC_ResidentAddress
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ResidentAddressModel> SaveResidentAddress(ResidentAddressModel request);
        /// <summary>
        /// 删除DC_ResidentAddress
        /// </summary>
        /// <param name="addressID"></param>
        BaseResponse DeleteResidentAddress(int addressID);
        #endregion
    }
}
