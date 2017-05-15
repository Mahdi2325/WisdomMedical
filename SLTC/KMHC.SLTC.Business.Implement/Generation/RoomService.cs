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
    
    public partial class RoomService : BaseService, IRoomService
    {
        #region ORG_Room
        public BaseResponse<IList<RoomModel>> QueryRoom(BaseRequest<RoomFilter> request)
        {
            var response = base.Query<ORG_Room, RoomModel>(request, (q) =>
            {
                if (request.Data.RoomID != 0)
                {
                    q = q.Where(m => m.RoomID == request.Data.RoomID);
                }
                q = q.OrderBy(m => m.RoomID);
                return q;
            });
            return response;
        }

        public BaseResponse<RoomModel> GetRoom(int roomID)
        {
            return base.Get<ORG_Room, RoomModel>((q) => q.RoomID == roomID);
        }

        public BaseResponse<RoomModel> SaveRoom(RoomModel request)
        {
            return base.Save<ORG_Room, RoomModel>(request, (q) => q.RoomID == request.RoomID);
        }

        public BaseResponse DeleteRoom(int roomID)
        {
            return base.Delete<ORG_Room>(roomID);
        }
        #endregion
    }
}
