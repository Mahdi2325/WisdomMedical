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

    public partial class CommodityItemService : BaseService, ICommodityItemService
    {
        #region DC_CommodityItem
        public BaseResponse<IList<CommodityItemModel>> QueryCommodityItem(BaseRequest<CommodityItemFilter> request)
        {
            var response = new BaseResponse<IList<CommodityItemModel>>();

            var q = from ci in unitOfWork.GetRepository<DC_CommodityItem>().dbSet.Where(a=>!a.IsDeleted)
                    join cic in unitOfWork.GetRepository<DC_CommodityType>().dbSet on ci.CICategory equals cic.CTypeID
                    into temp
                    from co in temp.DefaultIfEmpty()
                    select new
                    {
                        ci = ci,
                        CIType = co.CTypeName
                    };

            if (request != null)
            {
                if (request.Data.CommodityItemID.HasValue)
                {
                    q = q.Where(m => m.ci.CommodityItemID == request.Data.CommodityItemID);
                }
                if (request.Data.CICategory.HasValue)
                {
                    q = q.Where(m => m.ci.CICategory == request.Data.CICategory);
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.ci.OrganizationID == request.Data.OrganizationID);
                }
                if (!string.IsNullOrWhiteSpace(request.Data.CIName))
                {
                    q = q.Where(m => m.ci.CIName.Contains(request.Data.CIName));
                }
            }
            q = q.OrderBy(m => m.ci.OrderNum).ThenByDescending(m => m.ci.CreatedTime);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<CommodityItemModel>();
                foreach (dynamic item in list)
                {
                    var commodityItem = Mapper.DynamicMap<CommodityItemModel>(item.ci);
                    commodityItem.CICategoryName = item.CIType;
                    newList.Add(commodityItem);
                }
                response.Data = newList;
            };
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = q.ToList();
                mapperResponse(list);
            }

            return response;
        }

        public BaseResponse<CommodityItemModel> GetCommodityItem(int commodityItemID)
        {
            return base.Get<DC_CommodityItem, CommodityItemModel>((q) => q.CommodityItemID == commodityItemID);
        }

        public BaseResponse<CommodityItemModel> SaveCommodityItem(CommodityItemModel request)
        {
            return base.Save<DC_CommodityItem, CommodityItemModel>(request, (q) => q.CommodityItemID == request.CommodityItemID);
        }

        public BaseResponse DeleteCommodityItem(int commodityItemID)
        {
            var model = unitOfWork.GetRepository<DC_CommodityItem>().dbSet.FirstOrDefault((q) => q.CommodityItemID == commodityItemID);
            model.IsDeleted = true;
            unitOfWork.GetRepository<DC_CommodityItem>().Update(model);
            unitOfWork.Save();
            return new BaseResponse<DC_CommodityItem>() {
                Data = model,
                IsSuccess = true
            };
        }
        #endregion
    }
}
