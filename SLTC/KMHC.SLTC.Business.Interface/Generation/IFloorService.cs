namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IFloorService : IBaseService
    {
        #region ORG_Floor
        /// <summary>
        /// 获取ORG_Floor列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<FloorModel>> QueryFloor(BaseRequest<FloorFilter> request);
        /// <summary>
        /// 获取ORG_Floor
        /// </summary>
        /// <param name="floorID"></param>
        /// <returns></returns>
        BaseResponse<FloorModel> GetFloor(int floorID);
        /// <summary>
        /// 保存ORG_Floor
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<FloorModel> SaveFloor(FloorModel request);
        /// <summary>
        /// 删除ORG_Floor
        /// </summary>
        /// <param name="floorID"></param>
        BaseResponse DeleteFloor(int floorID);
        #endregion
    }
}
