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
    public interface IRefundService
    {
        /// <summary>
        /// 获取订单服务项目
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<SerOrdSerItModel>> GetServiceOrderByRsID(BaseRequest<PaymentsFilter> request);
        /// <summary>
        /// 订单服务项目退费
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<SerOrdSerItModel>> SaveRefundByRsId(SerOrdSerItModelList baseRequest);
        /// <summary>
        /// 获取已退费订单服务项目
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ServiceOrderChargeDtlModel>> GetRefundServiceOrder(BaseRequest<PaymentsFilter> request);
        
    }
}
