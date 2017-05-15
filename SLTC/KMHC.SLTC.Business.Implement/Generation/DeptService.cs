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

    public partial class DeptService : BaseService, IDeptService
    {
        #region ORG_Dept
        public BaseResponse<IList<DeptModel>> QueryDept(BaseRequest<DeptFilter> request)
        {
            var response = base.Query<ORG_Dept, DeptModel>(request, (q) =>
            {
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                } 
                if (!string.IsNullOrWhiteSpace(request.Data.DeptName))
                {
                    q = q.Where(m => m.DeptName.Contains(request.Data.DeptName));
                }
                q = q.OrderBy(m => m.DeptID);
                return q;
            });
            return response;
        }

        public BaseResponse<DeptModel> GetDept(int DeptID)
        {
            return base.Get<ORG_Dept, DeptModel>((q) => q.DeptID == DeptID);
        }

        public BaseResponse<DeptModel> SaveDept(DeptModel request)
        {
            return base.Save<ORG_Dept, DeptModel>(request, (q) => q.DeptID == request.DeptID);
        }

        public BaseResponse DeleteDept(int DeptID)
        {
            return base.Delete<ORG_Dept>(DeptID);
        }
        #endregion
    }
}
