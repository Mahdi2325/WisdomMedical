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
    
    public partial class FunctionService : BaseService, IFunctionService
    {
        #region SYS_Function
        public BaseResponse<IList<FunctionModel>> QueryFunction(BaseRequest<FunctionFilter> request)
        {
            var response = base.Query<SYS_Function, FunctionModel>(request, (q) =>
            {
                if (request != null) {
                    if (request.Data.FunctionID != 0)
                    {
                        q = q.Where(m => m.FunctionID == request.Data.FunctionID);
                    }
                    if (!string.IsNullOrEmpty(request.Data.FunctionNo))
                    {
                        q = q.Where(m => m.FunctionNo == request.Data.FunctionNo);
                    }
                    if (!string.IsNullOrEmpty(request.Data.Keywords))
                    {
                        q = q.Where(m => m.FunctionNo.Contains(request.Data.Keywords) || m.FunctionName.Contains(request.Data.Keywords));
                    }
                }
                q = q.OrderByDescending(m => m.CreatedTime);
                return q;
            });
            return response;
        }

        public BaseResponse<FunctionModel> GetFunction(int functionID)
        {
            return base.Get<SYS_Function, FunctionModel>((q) => q.FunctionID == functionID);
        }

        public BaseResponse<FunctionModel> SaveFunction(FunctionModel request)
        {
            return base.Save<SYS_Function, FunctionModel>(request, (q) => q.FunctionID == request.FunctionID);
        }

        public BaseResponse DeleteFunction(int functionID)
        {
            return base.Delete<SYS_Function>(functionID);
        }
        #endregion

        public BaseResponse<bool> SaveBatchFunction(List<FunctionModel> request)
        {
            BaseResponse<bool> response = new BaseResponse<bool>();
            var functionRepository = unitOfWork.GetRepository<SYS_Function>();
            foreach (var item in request)
            {
                SYS_Function function = Mapper.DynamicMap<SYS_Function>(item);
                functionRepository.Insert(function);
            }
            unitOfWork.Save();
            return response;
        }
    }
}
