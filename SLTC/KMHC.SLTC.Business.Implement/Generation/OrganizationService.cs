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

    public partial class OrganizationService : BaseService, IOrganizationService
    {
        #region ORG_Organization
        public BaseResponse<IList<OrganizationModel>> QueryOrganization(BaseRequest<OrganizationFilter> request)
        {
            BaseResponse<IList<OrganizationModel>> response = new BaseResponse<IList<OrganizationModel>>();
            var q = from org in unitOfWork.GetRepository<ORG_Organization>().dbSet.Where(a => a.IsDeleted == false)
                    join gro in unitOfWork.GetRepository<ORG_Group>().dbSet.Where(a => a.IsDeleted == false)
                    on org.GroupID equals gro.GroupID
                    select new OrganizationModel { GroupID = org.GroupID, OrganizationID = org.OrganizationID, OrgNo = org.OrgNo, OrgName = org.OrgName, Contact = org.Contact, Tel = org.Tel, GroupName = gro.GroupName, CreatedTime = org.CreatedTime };
            if (request == null || request.Data == null)
            {
                response.IsSuccess = false;
                return response;
            }

            if (!string.IsNullOrWhiteSpace(request.Data.OrgName))
            {
                q = q.Where(m => m.OrgName.Contains(request.Data.OrgName));
            }

            if (request.Data.OrgIds != null && request.Data.OrgIds.Length > 0)
            {
                q = q.Where(m => request.Data.OrgIds.Contains(m.OrganizationID));
            }
            if (request.Data.GroupID != 0 )//&& request.Data.IsGroupAdmin
            {
                q = q.Where(m => m.GroupID == request.Data.GroupID);
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

        public BaseResponse<OrganizationModel> GetOrganization(int organizationID)
        {
       
            return base.Get<ORG_Organization, OrganizationModel>((q) => q.OrganizationID == organizationID);
        }

        public BaseResponse<OrganizationModel> SaveOrganization(OrganizationModel request)
        {
            return base.Save<ORG_Organization, OrganizationModel>(request, (q) => q.OrganizationID == request.OrganizationID);
        }

        public BaseResponse DeleteOrganization(int organizationID)
        {
            return base.Delete<ORG_Organization>(organizationID);
        }
        #endregion
    }
}
