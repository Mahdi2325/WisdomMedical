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
    
    public partial class ActivityNewService : BaseService, IActivityNewService
    {
        #region DC_ActivityNew
        public BaseResponse<IList<ActivityNewModel>> QueryActivityNew(BaseRequest<ActivityNewFilter> request)
        {
            var response = base.Query<DC_ActivityNew, ActivityNewModel>(request, (q) =>
            {
                if (request.Data.ActivityNewID != 0)
                {
                    q = q.Where(m => m.ActivityNewID == request.Data.ActivityNewID);
                }
                q = q.OrderBy(m => m.ActivityNewID);
                return q;
            });
            return response;
        }

        public BaseResponse<ActivityNewModel> GetActivityNew(int activityNewID)
        {
            return base.Get<DC_ActivityNew, ActivityNewModel>((q) => q.ActivityNewID == activityNewID);
        }

        public BaseResponse<ActivityNewModel> SaveActivityNew(ActivityNewModel request)
        {
            return base.Save<DC_ActivityNew, ActivityNewModel>(request, (q) => q.ActivityNewID == request.ActivityNewID);
        }

        public BaseResponse DeleteActivityNew(int activityNewID)
        {
            return base.Delete<DC_ActivityNew>(activityNewID);
        }
        #endregion
    }
}
