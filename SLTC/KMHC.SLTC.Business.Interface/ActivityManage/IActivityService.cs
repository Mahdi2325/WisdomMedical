namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IActivityService : IBaseService
    {
        #region DC_ResidentAddress
        /// <summary>
        /// 获取活动列表
        /// </summary>
        /// <param name="organizationID"></param>
        /// <returns></returns>
        BaseResponse<IList<ActivityModel>> QueryActivity(BaseRequest<GroupActivityRecordFilter> request);
        /// <summary>
        /// 获取活动信息
        /// </summary>
        /// <param name="id"></param>
        /// <returns></returns>
        BaseResponse<ActivityModel> GetActivity(int id);
        /// <summary>
        /// 保存活动信息
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ActivityModel> SaveActivity(ActivityModel request);
        /// <summary>
        /// 删除活动
        /// </summary>
        /// <param name="addressID"></param>
        BaseResponse DeleteActivity(int id);
        /// <summary>
        /// 活动签到
        /// </summary>
        /// <param name="addressID"></param>
        BaseResponse SignActivity(ActivitySignFileter request);
        /// <summary>
        /// 根据时间获取活动列表
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        BaseResponse GetActivitiesForDate(string date, int organizationID);
        /// <summary>
        /// 根据月份获取当月的活动日期
        /// </summary>
        /// <param name="date"></param>
        /// <returns></returns>
        BaseResponse GetDatesForMonth(string date, int organizationID);
        #endregion
    }
}
