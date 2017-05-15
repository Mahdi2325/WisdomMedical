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

    public partial class CallInfoService : BaseService, ICallInfoService
    {
        #region ORG_Area
        public BaseResponse<IList<CallInfoModel>> QueryCallInfo(BaseRequest<CallInfoFilter> request)
        {
            var response = new BaseResponse<IList<CallInfoModel>>();
            var q = from a in unitOfWork.GetRepository<DC_CallInfo>().dbSet
                    select new CallInfoModel
                    { 
                        ID = a.ID,
                        PersonID = a.PersonID,
                        CallDate = a.CallDate,
                        CallCatagory = a.CallCatagory,
                        CallType = a.CallType,
                        ReferralOrg = a.ReferralOrg,
                        Status = a.Status,
                        Result = a.Result
                    };
            if (request.Data.PersonID.HasValue)
            {
                q = q.Where(m => m.PersonID == request.Data.PersonID.Value);
            }

            q = q.OrderByDescending(m => m.ID);
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

        public BaseResponse<CallInfoModel> GetCallInfo(int callInfoID)
        {
            return base.Get<DC_CallInfo, CallInfoModel>((q) => q.ID == callInfoID);
        }

        public BaseResponse<CallInfoModel> SaveCallInfo(CallInfoModel request)
        {
            return base.Save<DC_CallInfo, CallInfoModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteCallInfo(int callInfoID)
        {
            return base.Delete<DC_CallInfo>(callInfoID);
        }
        #endregion
    }
}
