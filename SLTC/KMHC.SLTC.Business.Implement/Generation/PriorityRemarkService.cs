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

    public partial class PriorityRemarkService : BaseService, IPriorityRemarkService
    {
        #region ORG_Area
        public BaseResponse<IList<PriorityRemarkModel>> QueryPriorityRemark(BaseRequest<PriorityRemarkFilter> request)
        {
            var response = new BaseResponse<IList<PriorityRemarkModel>>();
            var q = unitOfWork.GetRepository<DC_PriorityRemark>().dbSet.Where(a => a.PersonID == request.Data.PersonID);

            q = q.OrderByDescending(m => m.ID);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<PriorityRemarkModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<PriorityRemarkModel>>(list);
            }            
            return response;
        }

        public BaseResponse<PriorityRemarkModel> GetPriorityRemark(int priorityRemarkID)
        {
            return base.Get<DC_PriorityRemark, PriorityRemarkModel>((q) => q.ID == priorityRemarkID);
        }

        public BaseResponse<PriorityRemarkModel> SavePriorityRemark(PriorityRemarkModel request)
        {
            return base.Save<DC_PriorityRemark, PriorityRemarkModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeletePriorityRemark(int priorityRemarkID)
        {
            return base.Delete<DC_PriorityRemark>(priorityRemarkID);
        }
        #endregion
    }
}
