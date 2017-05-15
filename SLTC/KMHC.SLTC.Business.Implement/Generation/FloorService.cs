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
    
    public partial class FloorService : BaseService, IFloorService
    {
        #region ORG_Floor
        public BaseResponse<IList<FloorModel>> QueryFloor(BaseRequest<FloorFilter> request)
        {
            var response = base.Query<ORG_Floor, FloorModel>(request, (q) =>
            {
                if (request.Data.FloorID != 0)
                {
                    q = q.Where(m => m.FloorID == request.Data.FloorID);
                }
                q = q.OrderBy(m => m.FloorID);
                return q;
            });
            return response;
        }

        public BaseResponse<FloorModel> GetFloor(int floorID)
        {
            return base.Get<ORG_Floor, FloorModel>((q) => q.FloorID == floorID);
        }

        public BaseResponse<FloorModel> SaveFloor(FloorModel request)
        {
            return base.Save<ORG_Floor, FloorModel>(request, (q) => q.FloorID == request.FloorID);
        }

        public BaseResponse DeleteFloor(int floorID)
        {
            return base.Delete<ORG_Floor>(floorID);
        }
        #endregion
    }
}
