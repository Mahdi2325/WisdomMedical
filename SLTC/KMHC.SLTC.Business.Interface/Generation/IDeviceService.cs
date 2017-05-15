namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IDeviceService : IBaseService
    {
        #region DC_Device
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DeviceModel>> QueryDevice(BaseRequest<DeviceFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="deviceID"></param>
        /// <returns></returns>
        BaseResponse<DeviceModel> GetDevice(int deviceID);
        /// <summary>
        /// 保存DC_Device
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<DeviceModel> SaveDevice(DeviceModel request);
        /// <summary>
        /// 删除DC_Device
        /// </summary>
        /// <param name="deviceID"></param>
        BaseResponse DeleteDevice(int deviceID);
        #endregion
    }
}
