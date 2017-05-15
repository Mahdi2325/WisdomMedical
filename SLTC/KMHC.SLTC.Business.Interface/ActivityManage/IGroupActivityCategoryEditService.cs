namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IGroupActivityCategoryEditService : IBaseService
    {
        #region DC_GroupActivityCategory
        /// <summary>
        /// 获取DC_GroupActivityCategory列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<GroupActivityCategory>> QueryGroupActivity(BaseRequest<GroupActivityCategoryFilter> request);
        /// <summary>
        /// 获取DC_GroupActivityCategory
        /// </summary>
        /// <param name="serviceGroupID"></param>
        /// <returns></returns>
        BaseResponse<GroupActivityCategory> GetGroupActivityCategory(int ID);
        /// <summary>
        /// 保存DC_GroupActivityCategory
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<GroupActivityCategory> SaveGroupActivityCategory(GroupActivityCategory request);
        /// <summary>
        /// 删除DC_GroupActivityCategory
        /// </summary>
        /// <param name="serviceGroupID"></param>
        BaseResponse DeleteGroupActivityCategory(int ID);
        /// <summary>
        /// 保存DC_GroupActivityCategory
        /// </summary>
        /// <param name="request"></param>
        BaseResponse SaveActivityItems(IList<GroupActivityItem> request);
        #endregion
    }
}
