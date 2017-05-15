namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IRoomService : IBaseService
    {
        #region ORG_Room
        /// <summary>
        /// 获取ORG_Room列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<RoomModel>> QueryRoom(BaseRequest<RoomFilter> request);
        /// <summary>
        /// 获取ORG_Room
        /// </summary>
        /// <param name="roomID"></param>
        /// <returns></returns>
        BaseResponse<RoomModel> GetRoom(int roomID);
        /// <summary>
        /// 保存ORG_Room
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<RoomModel> SaveRoom(RoomModel request);
        /// <summary>
        /// 删除ORG_Room
        /// </summary>
        /// <param name="roomID"></param>
        BaseResponse DeleteRoom(int roomID);
        #endregion
    }
}
