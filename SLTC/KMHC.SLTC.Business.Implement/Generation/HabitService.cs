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
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    public partial class HabitService : BaseService, IHabitService
    {
        #region ORG_Area
        public BaseResponse<IList<HabitModel>> QueryHabit(BaseRequest<HabitFilter> request)
        {
            var response = new BaseResponse<IList<HabitModel>>();
            var q = unitOfWork.GetRepository<DC_Habit>().dbSet.Where(a=>a.PersonID==request.Data.PersonID);
            q = q.OrderByDescending(m => m.ID);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<HabitModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<HabitModel>>(list);
            }            
            return response;
        }

        public BaseResponse<HabitModel> GetHabit(int habitID)
        {
            return base.Get<DC_Habit, HabitModel>((q) => q.ID == habitID);
        }

        public BaseResponse<HabitModel> SaveHabit(HabitModel request)
        {
            return base.Save<DC_Habit, HabitModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteHabit(int habitID)
        {
            return base.Delete<DC_Habit>(habitID);
        }
        #endregion
    }
}
