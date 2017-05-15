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
    
    public partial class UserRelationService : BaseService, IUserRelationService
    {
        #region SYS_UserRelation
        public BaseResponse<IList<UserRelationModel>> QueryUserRelation(BaseRequest<UserRelationFilter> request)
        {
            var response = base.Query<SYS_UserRelation, UserRelationModel>(request, (q) =>
            {
                if (request.Data.UserRelationID != 0)
                {
                    q = q.Where(m => m.UserRelationID == request.Data.UserRelationID);
                }
                q = q.OrderBy(m => m.UserRelationID);
                return q;
            });
            return response;
        }

        public BaseResponse<UserRelationModel> GetUserRelation(int userRelationID)
        {
            return base.Get<SYS_UserRelation, UserRelationModel>((q) => q.UserRelationID == userRelationID);
        }

        public BaseResponse<UserRelationModel> SaveUserRelation(UserRelationModel request)
        {
            return base.Save<SYS_UserRelation, UserRelationModel>(request, (q) => q.UserRelationID == request.UserRelationID);
        }

        public BaseResponse DeleteUserRelation(int userRelationID)
        {
            return base.Delete<SYS_UserRelation>(userRelationID);
        }
        #endregion
    }
}
