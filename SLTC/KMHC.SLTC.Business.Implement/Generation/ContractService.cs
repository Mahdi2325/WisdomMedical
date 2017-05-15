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

    public partial class ContractService : BaseService, IContractService
    {
        #region ORG_Area
        public BaseResponse<IList<ContractModel>> QueryContract(BaseRequest<ContractFilter> request)
        {
            BaseResponse<IList<ContractModel>> response = new BaseResponse<IList<ContractModel>>();
            var q = from a in unitOfWork.GetRepository<DC_Contract>().dbSet.Where(a=>!a.IsDeleted)
                    join b in unitOfWork.GetRepository<DC_Person>().dbSet on a.PersonID equals b.PersonID
                    select new ContractModel { 
                        ID = a.ID,
                        ContractNo = a.ContractNo,
                        ContractValue = a.ContractValue,
                        DiscountInfo = a.DiscountInfo,
                        FinalValue = a.FinalValue,
                        StartTime = a.StartTime,
                        EndTime = a.EndTime,
                        ServiceType = a.ServiceType,
                        ContractForm = a.ContractForm,
                        CaseNature = a.CaseNature,
                        Description = a.Description,
                        ContractFile = a.ContractFile,
                        ReservedOperator = a.ReservedOperator.Value,
                        PersonID = a.PersonID,
                        PersonName = b.Name,
                        CreatedTime = a.CreatedTime
                    };
            if (request.Data.PersonID.HasValue)
            {
                q = q.Where(m => m.PersonID == request.Data.PersonID.Value);
            }

            if (!string.IsNullOrWhiteSpace(request.Data.ContractNo))
            {
                q = q.Where(m => m.ContractNo.Contains(request.Data.ContractNo));
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

        public BaseResponse<ContractModel> GetContract(int contractID)
        {
            return base.Get<DC_Contract, ContractModel>((q) => q.ID == contractID);
        }

        public BaseResponse<ContractModel> SaveContract(ContractModel request)
        {
            return base.Save<DC_Contract, ContractModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteContract(int contractID)
        {
            var contract = unitOfWork.GetRepository<DC_Contract>().Get(contractID);
            if (contract!=null)
            {
                contract.IsDeleted = true;
                unitOfWork.GetRepository<DC_Contract>().Update(contract);
                unitOfWork.Save();
            }
            return new BaseResponse();
        }
        #endregion
    }
}
