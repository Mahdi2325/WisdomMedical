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
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;
    
    public partial class ChargeItemService : BaseService, IChargeItemService
    {
        #region DC_ChargeItem
        public BaseResponse<IList<ChargeItemModel>> QueryChargeItem(BaseRequest<ChargeItemFilter> request)
        {
            var response = new BaseResponse<IList<ChargeItemModel>>();

            var q = from ci in unitOfWork.GetRepository<DC_ChargeItem>().dbSet.Where(a=>!a.IsDeleted)
                    select new
                    {
                        ci = ci
                    };

            if (request != null)
            {
                if (request.Data.ChargeItemID.HasValue)
                {
                    q = q.Where(m => m.ci.ChargeItemID == request.Data.ChargeItemID);
                }
                if (!string.IsNullOrWhiteSpace(request.Data.CIName))
                {
                    q = q.Where(m => m.ci.CIName.Contains(request.Data.CIName));
                }
            }
            q = q.OrderByDescending(m => m.ci.CreatedTime);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<List<ChargeItemModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<List<ChargeItemModel>>(list);
            }

            return response;
        }

        public BaseResponse<ChargeItemModel> GetChargeItem(int chargeItemID)
        {
            return base.Get<DC_ChargeItem, ChargeItemModel>((q) => q.ChargeItemID == chargeItemID);
        }

        public BaseResponse<ChargeItemModel> SaveChargeItem(ChargeItemModel request)
        {
            return base.Save<DC_ChargeItem, ChargeItemModel>(request, (q) => q.ChargeItemID == request.ChargeItemID);
        }

        public BaseResponse DeleteChargeItem(int chargeItemID)
        {
            var model = unitOfWork.GetRepository<DC_ChargeItem>().dbSet.FirstOrDefault((q) => q.ChargeItemID == chargeItemID);
            model.IsDeleted = true;
            unitOfWork.GetRepository<DC_ChargeItem>().Update(model);
            unitOfWork.Save();
            return new BaseResponse<DC_ChargeItem>() {
                Data = model,
                IsSuccess = true
            };
        }
        #endregion
    }
}
