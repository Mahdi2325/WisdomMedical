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

    public partial class AreaService : BaseService, IAreaService
    {
        #region ORG_Area
        public BaseResponse<IList<AreaModel>> QueryArea(BaseRequest<AreaFilter> request)
        {
            BaseResponse<IList<AreaModel>> response = new BaseResponse<IList<AreaModel>>();
            var q = from area in unitOfWork.GetRepository<ORG_Area>().dbSet.Where(a => a.IsDeleted == false)
                    join org in unitOfWork.GetRepository<ORG_Organization>().dbSet.Where(a => a.IsDeleted == false)
                    on area.OrganizationID equals org.OrganizationID
                    select new AreaModel { OrganizationID = area.OrganizationID, AreaID = area.AreaID, AreaNo = area.AreaNo, AreaName = area.AreaName, City = area.City, Address = area.Address, OrgName = org.OrgName, CreatedTime = area.CreatedTime };
            if (request.Data.OrganizationID != 0)
            {
                q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
            }
            if (request.Data.AreaID != 0)
            {
                q = q.Where(m => m.AreaID == request.Data.AreaID);
            }
            if (!string.IsNullOrWhiteSpace(request.Data.AreaName))
            {
                q = q.Where(m => m.AreaName.Contains(request.Data.AreaName));
            }
            q = q.OrderByDescending(m => m.CreatedTime);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }
            else
            {
                var list = q.ToList();
                response.Data = list;
            }            
            return response;
        }

        public BaseResponse<AreaModel> GetArea(int areaID)
        {
            return base.Get<ORG_Area, AreaModel>((q) => q.AreaID == areaID);
        }

        public BaseResponse<AreaModel> SaveArea(AreaModel request)
        {
            return base.Save<ORG_Area, AreaModel>(request, (q) => q.AreaID == request.AreaID);
        }

        public BaseResponse DeleteArea(int areaID)
        {
            return base.Delete<ORG_Area>(areaID);
        }
        #endregion
    }
}
