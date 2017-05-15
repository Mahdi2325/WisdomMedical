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
    
    public partial class ServiceItemCategoryService : BaseService, IServiceItemCategoryService
    {
        #region DC_ServiceItemCategory
        public BaseResponse<IList<ServiceItemCategoryModel>> QueryServiceItemCategory(BaseRequest<ServiceItemCategoryFilter> request)
        {
            var response = base.Query<DC_ServiceItemCategory, ServiceItemCategoryModel>(request, (q) =>
            {
                if (request != null) {
                    if (request.Data.ServiceItemCategoryID != 0)
                    {
                        q = q.Where(m => m.ServiceItemCategoryID == request.Data.ServiceItemCategoryID);
                    }
                    if (request.Data.OrganizationID != 0)
                    {
                        q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                    }
                    if (!string.IsNullOrEmpty(request.Data.KeyWords))
                    {
                        q = q.Where(m => m.SICNo.Contains(request.Data.KeyWords) || m.SICName.Contains(request.Data.KeyWords));
                    }
                }
                q = q.OrderBy(m => m.ServiceItemCategoryID);
                return q;
            });
            return response;
        }

        public BaseResponse<ServiceItemCategoryModel> GetServiceItemCategory(int serviceItemCategoryID)
        {
            return base.Get<DC_ServiceItemCategory, ServiceItemCategoryModel>((q) => q.ServiceItemCategoryID == serviceItemCategoryID);
        }

        public BaseResponse<ServiceItemCategoryModel> SaveServiceItemCategory(ServiceItemCategoryModel request)
        {
            return base.Save<DC_ServiceItemCategory, ServiceItemCategoryModel>(request, (q) => q.ServiceItemCategoryID == request.ServiceItemCategoryID);
        }

        public BaseResponse DeleteServiceItemCategory(int serviceItemCategoryID)
        {
            return base.Delete<DC_ServiceItemCategory>(serviceItemCategoryID);
        }
        #endregion
    }
}
