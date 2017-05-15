namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IActivityNewService : IBaseService
    {
        #region DC_ActivityNew
        /// <summary>
        /// 获取DC_ActivityNew列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ActivityNewModel>> QueryActivityNew(BaseRequest<ActivityNewFilter> request);
        /// <summary>
        /// 获取DC_ActivityNew
        /// </summary>
        /// <param name="activityNewID"></param>
        /// <returns></returns>
        BaseResponse<ActivityNewModel> GetActivityNew(int activityNewID);
        /// <summary>
        /// 保存DC_ActivityNew
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ActivityNewModel> SaveActivityNew(ActivityNewModel request);
        /// <summary>
        /// 删除DC_ActivityNew
        /// </summary>
        /// <param name="activityNewID"></param>
        BaseResponse DeleteActivityNew(int activityNewID);
        #endregion
    }
}
