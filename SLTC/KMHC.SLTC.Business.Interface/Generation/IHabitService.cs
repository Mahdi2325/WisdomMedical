namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IHabitService : IBaseService
    {
        #region DC_Habit
        /// <summary>
        /// 获取DC_Contract列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<HabitModel>> QueryHabit(BaseRequest<HabitFilter> request);
        /// <summary>
        /// 获取DC_Contract
        /// </summary>
        /// <param name="habitID"></param>
        /// <returns></returns>
        BaseResponse<HabitModel> GetHabit(int habitID);
        /// <summary>
        /// 保存DC_Habit
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<HabitModel> SaveHabit(HabitModel request);
        /// <summary>
        /// 删除DC_Habit
        /// </summary>
        /// <param name="habitID"></param>
        BaseResponse DeleteHabit(int habitID);
        #endregion
    }
}
