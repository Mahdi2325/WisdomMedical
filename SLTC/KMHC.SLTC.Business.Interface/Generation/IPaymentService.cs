namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IPaymentService : IBaseService
    {
        #region DC_Payment
        /// <summary>
        /// 获取DC_Payment列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<PaymentModel>> QueryPayment(BaseRequest<PaymentFilter> request);
        /// <summary>
        /// 获取DC_Payment
        /// </summary>
        /// <param name="paymentID"></param>
        /// <returns></returns>
        BaseResponse<PaymentModel> GetPayment(int paymentID);
        /// <summary>
        /// 保存DC_Payment
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<PaymentModel> SavePayment(PaymentModel request);
        /// <summary>
        /// 删除DC_Payment
        /// </summary>
        /// <param name="paymentID"></param>
        BaseResponse DeletePayment(int paymentID);
        #endregion
    }
}
