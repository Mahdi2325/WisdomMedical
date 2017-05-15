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

    public partial class ResidentAddressService : BaseService, IResidentAddressService
    {
        #region DC_ResidentAddress
        public BaseResponse<IList<ResidentAddressModel>> QueryResidentAddress(int residentID)
        {
            BaseResponse<IList<ResidentAddressModel>> response = new BaseResponse<IList<ResidentAddressModel>>();
            var q = from address in unitOfWork.GetRepository<DC_ResidentAddress>().dbSet.Where(a => a.ResidentID == residentID)
                    orderby  address.IsUsed descending
                    select address;
            response.Data = Mapper.DynamicMap <IList<ResidentAddressModel>>(q.ToList());                  
            return response;
        }

        public BaseResponse<ResidentAddressModel> GetResidentAddress(int addressID)
        {
            return base.Get<DC_ResidentAddress, ResidentAddressModel>((q) => q.AddressID == addressID);
        }

        public BaseResponse<ResidentAddressModel> SaveResidentAddress(ResidentAddressModel request)
        {
            if (request.IsUsed.HasValue && request.IsUsed.Value)
            {
                var raRepository = unitOfWork.GetRepository<DC_ResidentAddress>();
                var queryRs = QueryResidentAddress(request.ResidentID);
                var q = unitOfWork.GetRepository<DC_ResidentAddress>().dbSet.Where(a => a.ResidentID == request.ResidentID);
                q.ToList().ForEach(a => { a.IsUsed = false; raRepository.Update(a); });
            }
            return base.Save<DC_ResidentAddress, ResidentAddressModel>(request, (q) => q.AddressID == request.AddressID);
        }

        public BaseResponse DeleteResidentAddress(int addressID)
        {
            return base.Delete<DC_ResidentAddress>(addressID);
        }
        #endregion
    }
}
