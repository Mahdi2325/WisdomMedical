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
    
    public partial class SerOrdSerItService : BaseService, ISerOrdSerItService
    {
        #region DC_SerOrdSerIt
        public BaseResponse<IList<SerOrdSerItModel>> QuerySerOrdSerIt(BaseRequest<SerOrdSerItFilter> request)
        {
            var response = base.Query<DC_SerOrdSerIt, SerOrdSerItModel>(request, (q) =>
            {
                if (request.Data.ServiceOrderSIID != 0)
                {
                    q = q.Where(m => m.ServiceOrderSIID == request.Data.ServiceOrderSIID);
                }
                q = q.OrderBy(m => m.ServiceOrderSIID);
                return q;
            });
            return response;
        }

        public BaseResponse<SerOrdSerItModel> GetSerOrdSerIt(int serviceOrderSIID)
        {
            return base.Get<DC_SerOrdSerIt, SerOrdSerItModel>((q) => q.ServiceOrderSIID == serviceOrderSIID);
        }

        public BaseResponse<SerOrdSerItModel> SaveSerOrdSerIt(SerOrdSerItModel request)
        {
            return base.Save<DC_SerOrdSerIt, SerOrdSerItModel>(request, (q) => q.ServiceOrderSIID == request.ServiceOrderSIID);
        }

        public BaseResponse DeleteSerOrdSerIt(int serviceOrderSIID)
        {
            return base.Delete<DC_SerOrdSerIt>(serviceOrderSIID);
        }
        #endregion
    }
}
