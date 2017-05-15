namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IUserRelationService : IBaseService
    {
        #region SYS_UserRelation
        /// <summary>
        /// 获取SYS_UserRelation列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<UserRelationModel>> QueryUserRelation(BaseRequest<UserRelationFilter> request);
        /// <summary>
        /// 获取SYS_UserRelation
        /// </summary>
        /// <param name="userRelationID"></param>
        /// <returns></returns>
        BaseResponse<UserRelationModel> GetUserRelation(int userRelationID);
        /// <summary>
        /// 保存SYS_UserRelation
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<UserRelationModel> SaveUserRelation(UserRelationModel request);
        /// <summary>
        /// 删除SYS_UserRelation
        /// </summary>
        /// <param name="userRelationID"></param>
        BaseResponse DeleteUserRelation(int userRelationID);
        #endregion
    }
}
