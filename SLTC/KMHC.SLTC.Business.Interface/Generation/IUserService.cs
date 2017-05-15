using KMHC.Infrastructure.Security;

namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IUserService : IBaseService
    {
        #region SYS_User
        /// <summary>
        /// 获取SYS_User列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<UserModel>> QueryUser(BaseRequest<UserFilter> request);
        /// <summary>
        /// 获取SYS_User
        /// </summary>
        /// <param name="userID"></param>
        /// <returns></returns>
        BaseResponse<UserModel> GetUser(int userID);
        BaseResponse<string> ChangePassword(string userId, string newPassword, string oldPassword);
        /// <summary>
        /// 保存SYS_User
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<UserModel> SaveUser(UserModel request);
        /// <summary>
        /// 删除SYS_User
        /// </summary>
        /// <param name="userID"></param>
        BaseResponse DeleteUser(int userID);


        BaseResponse<UserModel> Login(UserModel baseRequest);

        /// <summary>
        /// 登录
        /// </summary>
        /// <param name="pwd"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        bool Login(string name, string pwd, out ClientUserData user);


        #endregion
    }
}
