namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IServiceOrderService : IBaseService
    {
        #region DC_ServiceOrder
        /// <summary>
        /// 获取DC_ServiceOrder列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceOrderModel>> QueryServiceOrder(BaseRequest<ServiceOrderFilter> request);
        /// <summary>
        /// 获取DC_ServiceOrder
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        BaseResponse<ServiceOrderModel> GetServiceOrder(int serviceOrderID);
        /// <summary>
        /// 保存DC_ServiceOrder
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ServiceOrderModel> SaveOrder(ServiceOrderModel request);
        /// <summary>
        /// 删除DC_ServiceOrder
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse DeleteServiceOrder(int serviceOrderID);
        /// <summary>
        /// 商品订单结算
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <param name="payment"></param>
        /// <returns></returns>
        BaseResponse<ServiceOrderModel> OrderSettlement(int serviceOrderID, string payment);
        /// <summary>
        /// 取消订单
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse CancelOrder(int serviceOrderID);        
        /// <summary>
        /// 确认取货
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse ConfirmOrder(int serviceOrderID);
        /// <summary>
        /// 获取雇员时间段
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse<List<EmpPlanModel>> GetDatePlan(EmpPlanFilter request);
        /// <summary>
        /// 申请退款
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse<string> RefundApply(RefundRecordFilter filter);

        /// <summary>
        /// 获取退款列表
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse<List<RefundRecordModel>> GetRefundList(int ServiceOrderID);
        
        /// <summary>
        /// 获取退款信息
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse<RefundRecordModel> GetRefundInfo(int id);
        /// <summary>
        /// 获取需要审核的退款信息
        /// </summary>
        /// <param name="serviceOrderID"></param>
        BaseResponse<RefundRecordModel> GetAuditRefund(int serviceOrderID);
        /// <summary>
        /// 审核退款信息
        /// </summary>
        /// <param name="filter"></param>
        BaseResponse AuditRefund(RefundRecordFilter filter);
        BaseResponse AdminCancelOrder(int serviceOrderID);
        #endregion
    }
}
