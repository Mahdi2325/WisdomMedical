using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model.FinancialManagement;

namespace KMHC.SLTC.Business.Interface
{
    public interface IPaymentsService
    {
        /// <summary>
        /// 获取订单服务项目
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<SerOrdSerItModel>> GetServiceOrderByRsID(BaseRequest<PaymentsFilter> request);
        /// <summary>
        /// 获取预收款余额
        /// </summary>
        /// <param name="residentID"></param>
        /// <returns></returns>
        BaseResponse<DepositModel> GetPreHasAmountByRsID(int residentID);
        /// <summary>
        /// 订单服务项目收费
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<SerOrdSerItModel>> SavePaymentByRsId(SerOrdSerItModelList baseRequest);
        /// <summary>
        /// 获取已缴费订单服务项目
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceOrderChargeDtlModel>> GetServiceOrderRecByRsID(BaseRequest<PaymentsFilter> request);
        
    }
}
