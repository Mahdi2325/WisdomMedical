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

    public partial class FamilyService : BaseService, IFamilyService
    {
        #region ORG_Area
        public BaseResponse<IList<FamilyModel>> QueryFamily(BaseRequest<FamilyFilter> request)
        {
            var response = new BaseResponse<IList<FamilyModel>>();
            var q = unitOfWork.GetRepository<DC_Family>().dbSet.Where(a => a.PersonID == request.Data.PersonID.Value);
            if (request.Data.IsEmerg.HasValue)
            {
                q = q.Where(a=>a.IsEmerg==request.Data.IsEmerg);
            }

            q = q.OrderByDescending(m => m.ID);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<FamilyModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<FamilyModel>>(list);
            }            
            return response;
        }

        public BaseResponse<FamilyModel> GetFamily(int familyID)
        {
            return base.Get<DC_Family, FamilyModel>((q) => q.ID == familyID);
        }

        public BaseResponse<FamilyModel> SaveFamily(FamilyModel request)
        {
            return base.Save<DC_Family, FamilyModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteFamily(int familyID)
        {
            return base.Delete<DC_Family>(familyID);
        }
        #endregion
    }
}
