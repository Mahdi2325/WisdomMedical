namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public partial class PaymentService : BaseService, IPaymentService
    {
        #region DC_Payment
        public BaseResponse<IList<PaymentModel>> QueryPayment(BaseRequest<PaymentFilter> request)
        {
            var response = new BaseResponse<IList<PaymentModel>>();

            var q = from a in unitOfWork.GetRepository<DC_Payment>().dbSet
                    select a;
            q = q.Where(m => m.ResidentID == request.Data.ResidentID);
            if (request.Data.PaymentID != 0)
            {
                q = q.Where(m => m.PaymentID == request.Data.PaymentID);
            }
            if (!string.IsNullOrWhiteSpace(request.Data.PayType))
            {
                q = q.Where(m => m.PayType == request.Data.PayType);
            }
            if (request.Data.PayDateFrom.HasValue)
            {
                q = q.Where(m => m.PayDate >= request.Data.PayDateFrom.Value);
            }
            if (request.Data.PayDateTo.HasValue)
            {
                request.Data.PayDateTo = request.Data.PayDateTo.Value.AddDays(1);
                q = q.Where(m => m.PayDate < request.Data.PayDateTo.Value);
            }

            q = q.OrderByDescending(m => m.PayDate);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<PaymentModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<PaymentModel>>(list);
            }
            return response;
        }

        public BaseResponse<PaymentModel> GetPayment(int paymentID)
        {
            return base.Get<DC_Payment, PaymentModel>((q) => q.PaymentID == paymentID);
        }

        public BaseResponse<PaymentModel> SavePayment(PaymentModel request)
        {
            return base.Save<DC_Payment, PaymentModel>(request, (q) => q.PaymentID == request.PaymentID);
        }

        public BaseResponse DeletePayment(int paymentID)
        {
            return base.Delete<DC_Payment>(paymentID);
        }
        #endregion
    }
}
