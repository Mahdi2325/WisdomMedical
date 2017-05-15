using AutoMapper;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Implement
{
    public partial class VolunteerService : BaseService, IVolunteerService
    {
        #region
        /// <summary>
        /// 获取志愿者列表以及团体活动时间汇总空数据List
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BaseResponse<IList<VolunteerModel>> QueryVolunteer(BaseRequest<VolunteerFilter> request)
        {
            request.PageSize = 0;
            var response = new BaseResponse<IList<VolunteerModel>>() { };
            var q = from m in unitOfWork.GetRepository<ORG_Employee>().dbSet
                    select new VolunteerModel
                    {
                        EmployeeId = m.EmployeeID,
                        EmpName = m.EmpName,
                        IsDeleted = m.IsDeleted,
                        OrganizationId = m.OrganizationID,
                    };

            q = q.Where(m => m.IsDeleted == false);
            q = q.Where(m => m.OrganizationId == SecurityHelper.CurrentPrincipal.OrgId);

            if (!string.IsNullOrEmpty(request.Data.Keywords))
            {
                q = q.Where(a => a.EmpName.Contains(request.Data.Keywords));
            }

            q = q.OrderBy(m => m.EmployeeId);
            response.RecordsCount = q.Count();
            List<VolunteerModel> list = null;
            if (request != null && request.PageSize > 0)
            {
                list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            }
            else
            {
                list = q.ToList();
            }
            response.Data = Mapper.DynamicMap<IList<VolunteerModel>>(list);
            return response;
        }
        /// <summary>
        /// 获取团体活动类别
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BaseResponse<IList<GroupActivityCategory>> QueryGroupActivity(BaseRequest<GroupActivityCategoryFilter> request)
        {
            var response = new BaseResponse<IList<GroupActivityCategory>>();
            var q = from m in unitOfWork.GetRepository<DC_GroupActivityCategory>().dbSet
                    select m;
            q = q.Where(m => m.OrganizationID == SecurityHelper.CurrentPrincipal.OrgId);
            q = q.OrderBy(m => m.ID);
            List<DC_GroupActivityCategory> list = q.ToList();
            var data = new List<GroupActivityCategory>();
            var groupActivityCategory = new GroupActivityCategory();
            foreach (var item in list)
            {
                groupActivityCategory.ID = item.ID;
                groupActivityCategory.CategoryName = item.CategoryName;
                groupActivityCategory.IsDeleted = item.IsDeleted.Value;
                groupActivityCategory.GroupActivityItem = Mapper.DynamicMap<List<GroupActivityItem>>(item.DC_GroupActivityItem);
                data.Add(groupActivityCategory);
                groupActivityCategory = new GroupActivityCategory();
            }
            response.Data = data;
            return response;
        }
        /// <summary>
        /// 获取团体活动记录数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BaseResponse<IList<GroupActivityRecord>> QueryGroupActivityRecord(BaseRequest<GroupActivityRecordFilter> request)
        {
            request.PageSize = 0;
            BaseResponse<IList<GroupActivityRecord>> response = new BaseResponse<IList<GroupActivityRecord>>();
            var q = from m in unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet
                    select m;
            q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
            if (request.Data.StartTime.HasValue)
            {
                q = q.Where(m => m.StartTime.Value.CompareTo(request.Data.StartTime.Value) >= 0);
            }
            if (request.Data.EndTime.HasValue)
            {
                q = q.Where(m => m.StartTime.Value.CompareTo(request.Data.EndTime.Value) <= 0);
            }
            q = q.OrderBy(m => m.ID);
            response.RecordsCount = q.Count();
            List<DC_GroupActivityRecord> list = null;
            if (request != null && request.PageSize > 0)
            {
                list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            }
            else
            {
                list = q.ToList();
            }
            response.Data = Mapper.DynamicMap<IList<GroupActivityRecord>>(list);
            return response;
        }
        /// <summary>
        /// 帮扶结对数据
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BaseResponse<IList<GroupActivityTask>> QueryGroupActivityTask(BaseRequest<GroupActivityTaskFilter> request)
        {
            request.PageSize = 0;
            var response = new BaseResponse<IList<GroupActivityTask>>() { };
            var q = from m in unitOfWork.GetRepository<DC_Task>().dbSet
                    select new GroupActivityTask
                    {
                        EmployeeId = m.EmployeeId,
                        BeginTime = m.BeginTime,
                        EndTime = m.EndTime,
                        Status = m.Status,
                        IsDeleted = m.IsDeleted,
                        OrganizationId = m.OrganizationID,
                    };
            q = q.Where(m => m.OrganizationId == request.Data.OrganizationID);
            q = q.Where(m => !m.IsDeleted);
            q = q.Where(m => m.Status == "Finish");
            if (!string.IsNullOrEmpty(request.Data.StartTime))
            {
                var startDate = Convert.ToDateTime(request.Data.StartTime).Date;
                q = q.Where(m => m.BeginTime >= startDate);
            }
            if (!string.IsNullOrEmpty(request.Data.EndTime))
            {
                var endDate = Convert.ToDateTime(request.Data.EndTime).AddDays(1).Date;
                q = q.Where(m => m.BeginTime < endDate);
            }
            q = q.OrderBy(m => m.EmployeeId);
            response.RecordsCount = q.Count();
            List<GroupActivityTask> list = null;
            if (request != null && request.PageSize > 0)
            {
                list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            }
            else
            {
                list = q.ToList();
            }
            response.Data = Mapper.DynamicMap<IList<GroupActivityTask>>(list);
            return response;
        }
        #endregion
    }
}
