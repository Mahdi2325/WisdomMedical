namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IRoleService : IBaseService
    {
        #region SYS_Role
        /// <summary>
        /// 获取SYS_Role列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<RoleModel>> QueryRole(BaseRequest<RoleFilter> request);
        /// <summary>
        /// 获取SYS_Role
        /// </summary>
        /// <param name="roleID"></param>
        /// <returns></returns>
        BaseResponse<RoleModel> GetRole(int roleID);
        /// <summary>
        /// 保存SYS_Role
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<RoleModel> SaveRole(RoleModel request);
        /// <summary>
        /// 删除SYS_Role
        /// </summary>
        /// <param name="roleID"></param>
        BaseResponse DeleteRole(int roleID);


        /// <summary>
        /// 超级管理菜单
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        IEnumerable<FunctionModel> GetRoleFunction(RoleFunctionFilter request);

        /// <summary>
        /// 普通用户菜单
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        IEnumerable<FunctionModel> GetRoleMenu(RoleFunctionFilter request);

        #endregion
    }
}
