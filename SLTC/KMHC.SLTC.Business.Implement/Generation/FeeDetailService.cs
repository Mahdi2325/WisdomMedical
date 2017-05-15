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

    public partial class FeeDetailService : BaseService, IFeeDetailService
    {
        #region DC_SerOrdSerItChgIt
        public BaseResponse<IList<FeeDetailModel>> QueryFeeDetail(BaseRequest<FeeDetailFilter> request)
        {
            var response = new BaseResponse<IList<FeeDetailModel>>();

            var q = from a in unitOfWork.GetRepository<DC_FeeDetail>().dbSet
                    select a;

            if (request.Data.FeeDetailID != 0)
            {
                q = q.Where(m => m.FeeDetailID == request.Data.FeeDetailID);
            }
            if (request.Data.BillID != 0)
            {
                q = q.Where(m => m.BillID == request.Data.BillID);
            }
            if (request.Data.StartDate.HasValue)
            {
                q = q.Where(m => m.FeeDate >= request.Data.StartDate.Value);
            }
            if (request.Data.EndDate.HasValue)
            {
                request.Data.EndDate = request.Data.EndDate.Value.AddDays(1);
                q = q.Where(m => m.FeeDate < request.Data.EndDate.Value);
            }
            q = q.Where(m => m.ResidentID == request.Data.ResidentID);
            q = q.OrderByDescending(m => m.FeeDate);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<FeeDetailModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<FeeDetailModel>>(list);
            }
            return response;
        }

        public BaseResponse<FeeDetailModel> GetFeeDetail(int feeDetailID)
        {
            return base.Get<DC_FeeDetail, FeeDetailModel>((q) => q.FeeDetailID == feeDetailID);
        }

        public BaseResponse<FeeDetailModel> SaveFeeDetail(FeeDetailModel request)
        {
            return base.Save<DC_FeeDetail, FeeDetailModel>(request, (q) => q.FeeDetailID == request.FeeDetailID);
        }

        public BaseResponse DeleteFeeDetail(int feeDetailID)
        {
            return base.Delete<DC_FeeDetail>(feeDetailID);
        }
        #endregion
    }
}
