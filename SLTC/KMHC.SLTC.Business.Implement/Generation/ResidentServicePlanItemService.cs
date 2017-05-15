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
    
    public partial class ResidentServicePlanItemService : BaseService, IResidentServicePlanItemService
    {
        #region DC_ResidentServicePlanItem
        public BaseResponse<IList<ResidentServicePlanItemModel>> QueryResidentServicePlanItem(BaseRequest<ResidentServicePlanItemFilter> request)
        {
            var response = base.Query<DC_ResidentServicePlanItem, ResidentServicePlanItemModel>(request, (q) =>
            {
                if (request.Data.ResidentServicePlanItemID != 0)
                {
                    q = q.Where(m => m.ResidentServicePlanItemID == request.Data.ResidentServicePlanItemID);
                }
                q = q.OrderBy(m => m.ResidentServicePlanItemID);
                return q;
            });
            return response;
        }

        public BaseResponse<ResidentServicePlanItemModel> GetResidentServicePlanItem(int residentServicePlanItemID)
        {
            return base.Get<DC_ResidentServicePlanItem, ResidentServicePlanItemModel>((q) => q.ResidentServicePlanItemID == residentServicePlanItemID);
        }

        public BaseResponse<ResidentServicePlanItemModel> SaveResidentServicePlanItem(ResidentServicePlanItemModel request)
        {
            return base.Save<DC_ResidentServicePlanItem, ResidentServicePlanItemModel>(request, (q) => q.ResidentServicePlanItemID == request.ResidentServicePlanItemID);
        }

        public BaseResponse DeleteResidentServicePlanItem(int residentServicePlanItemID)
        {
            return base.Delete<DC_ResidentServicePlanItem>(residentServicePlanItemID);
        }
        #endregion
    }
}
