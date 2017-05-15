using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using System.Collections.Generic;
using KMHC.SLTC.Business.Entity.Model.Report;

namespace KMHC.SLTC.Business.Interface
{
    public interface IReportManageService : IBaseService
    {
        /// <summary>
        /// 查询报表（测试例子）
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ReportModel>> QueryReport(BaseRequest<ReportFilter> request);

        BaseResponse<ResidentPercentageModel> GetResidentPercentage(int organizationId);

        BaseResponse<IList<ServiceStatisticModel>> GetTop10Service(int organizationId);

        BaseResponse<IList<PaymentDistributeModel>> GetPaymentDistribute(int organizationId);

        BaseResponse<IList<ResidentAgeModel>> GetResidentAgeDistribute(int organizationId);
    }
}
