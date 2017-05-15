namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IGroupService : IBaseService
    {
        #region ORG_Group
        /// <summary>
        /// 获取ORG_Group列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<GroupModel>> QueryGroup(BaseRequest<GroupFilter> request);
        /// <summary>
        /// 获取ORG_Group
        /// </summary>
        /// <param name="groupID"></param>
        /// <returns></returns>
        BaseResponse<GroupModel> GetGroup(int groupID);
        /// <summary>
        /// 保存ORG_Group
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<GroupModel> SaveGroup(GroupModel request);
        /// <summary>
        /// 删除ORG_Group
        /// </summary>
        /// <param name="groupID"></param>
        BaseResponse DeleteGroup(int groupID);
        #endregion
    }
}
