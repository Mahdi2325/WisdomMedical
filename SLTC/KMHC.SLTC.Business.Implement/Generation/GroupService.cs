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
    
    public partial class GroupService : BaseService, IGroupService
    {
        #region ORG_Group
        public BaseResponse<IList<GroupModel>> QueryGroup(BaseRequest<GroupFilter> request)
        {
            var response = base.Query<ORG_Group, GroupModel>(request, (q) =>
            {
                if (request.Data.GroupID != 0)
                {
                    q = q.Where(m => m.GroupID == request.Data.GroupID);
                }
                if (!string.IsNullOrWhiteSpace(request.Data.GroupName))
                {
                    q = q.Where(m => m.GroupName.Contains(request.Data.GroupName));
                }
                q = q.OrderByDescending(m => m.CreatedTime);
                return q;
            });         
            return response;           
        }

        public BaseResponse<GroupModel> GetGroup(int groupID)
        {
            return base.Get<ORG_Group, GroupModel>((q) => q.GroupID == groupID);
        }

        public BaseResponse<GroupModel> SaveGroup(GroupModel request)
        {
            return base.Save<ORG_Group, GroupModel>(request, (q) => q.GroupID == request.GroupID);
        }

        public BaseResponse DeleteGroup(int groupID)
        {
            return base.Delete<ORG_Group>(groupID);
        }
        #endregion
    }
}
