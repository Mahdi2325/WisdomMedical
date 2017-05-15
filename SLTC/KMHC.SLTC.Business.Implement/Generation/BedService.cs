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
    
    public partial class BedService : BaseService, IBedService
    {
        #region ORG_Bed
        public BaseResponse<IList<BedModel>> QueryBed(BaseRequest<BedFilter> request)
        {
            var response = base.Query<ORG_Bed, BedModel>(request, (q) =>
            {
                if (request.Data.BedID != 0)
                {
                    q = q.Where(m => m.BedID == request.Data.BedID);
                }
                q = q.OrderBy(m => m.BedID);
                return q;
            });
            return response;
        }

        public BaseResponse<BedModel> GetBed(int bedID)
        {
            return base.Get<ORG_Bed, BedModel>((q) => q.BedID == bedID);
        }

        public BaseResponse<BedModel> SaveBed(BedModel request)
        {
            return base.Save<ORG_Bed, BedModel>(request, (q) => q.BedID == request.BedID);
        }

        public BaseResponse DeleteBed(int bedID)
        {
            return base.Delete<ORG_Bed>(bedID);
        }
        #endregion
    }
}
