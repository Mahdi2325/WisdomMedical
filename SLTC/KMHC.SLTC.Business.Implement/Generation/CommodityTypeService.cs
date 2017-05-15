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

    public partial class CommodityTypeService : BaseService, ICommodityTypeService
    {
        #region DC_CommodityType
        public BaseResponse<IList<CommodityTypeModel>> QueryCommodityType(BaseRequest<CommodityTypeFilter> request)
        {
            var response = base.Query<DC_CommodityType, CommodityTypeModel>(request, (q) =>
            {
                if (request != null) {
                    if (request.Data.OrganizationID != 0)
                    {
                        q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                    }
                    if (!string.IsNullOrEmpty(request.Data.KeyWords))
                    {
                        q = q.Where(m => m.CTypeName.Contains(request.Data.KeyWords));
                    }
                }
                q = q.OrderBy(m => m.OrderBy);
                return q;
            });
            return response;
        }

        public BaseResponse<CommodityTypeModel> GetCommodityType(int commodityTypeID)
        {
            return base.Get<DC_CommodityType, CommodityTypeModel>((q) => q.CTypeID == commodityTypeID);
        }

        public BaseResponse<CommodityTypeModel> SaveCommodityType(CommodityTypeModel request)
        {
            return base.Save<DC_CommodityType, CommodityTypeModel>(request, (q) => q.CTypeID == request.CTypeID);
        }

        public BaseResponse DeleteCommodityType(int commodityTypeID)
        {
            return base.Delete<DC_CommodityType>(commodityTypeID);
        }
        #endregion
    }
}
