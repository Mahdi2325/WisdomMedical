namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IComOrderService : IBaseService
    {
        #region DC_Device
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceOrderModel>> QueryComOrder(BaseRequest<ServiceOrderFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="deviceID"></param>
        /// <returns></returns>
        BaseResponse<ServiceOrderModel> GetComOrder(int serviceOrderID);
        /// <summary>
        /// 保存DC_Device
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ServiceOrderModel> SaveOrder(ServiceOrderModel request);
        BaseResponse DeleteServiceOrder(int serviceOrderID);
        /// <summary>
        /// 删除DC_Device
        /// </summary>
        /// <param name="deviceID"></param>
        BaseResponse SyncToCheckQueue(IList<int> orderSiIds, int operatorId);
        BaseResponse CancelOrder(int serviceOrderID, int opreatorId);
        BaseResponse RemoveFromCheckQueue(IList<int> orderSiIds, int operatorId);
        BaseResponse<List<SerOrdSerItModel>> GetOrderItems(int serviceOrderID);
        #endregion
    }
}
