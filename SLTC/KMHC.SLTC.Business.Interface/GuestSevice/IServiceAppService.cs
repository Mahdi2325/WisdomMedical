namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IServiceAppService : IBaseService
    {
        #region DC_Device
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceAppointmentModel>> QueryServiceApp(BaseRequest<ServiceAppFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="deviceID"></param>
        /// <returns></returns>
        BaseResponse<ServiceAppointmentModel> GetServiceApp(int serviceAppID);
        /// <summary>
        /// 保存DC_Device
        /// </summary>
        /// <param name="request"></param>
        BaseResponse DeleteServiceAppointment(int serviceAppID);
        BaseResponse SaveServiceApp(ServiceAppointmentModel request);
        /// <summary>
        /// 删除DC_Device
        /// </summary>
        /// <param name="deviceID"></param>
        BaseResponse CancelApp(int serviceAppID);
        BaseResponse<List<PNCModel>> GetPNCList(System.DateTime date);
        #endregion
    }
}
