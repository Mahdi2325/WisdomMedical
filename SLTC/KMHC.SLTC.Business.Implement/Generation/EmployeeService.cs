using System.Collections;

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

    public partial class EmployeeService : BaseService, IEmployeeService
    {
        #region ORG_Employee
        public BaseResponse<IList<EmployeeModel>> QueryEmployee(BaseRequest<EmployeeFilter> request)
        {
              if (request == null || request.Data == null)
                {
                    return new BaseResponse<IList<EmployeeModel>>();
                }
            if (request.Data.UserId.HasValue)//依据用户Id得到员工信息
            {
                return new BaseResponse<IList<EmployeeModel>>()
                {
                    Data = GetEmployees(request.Data.UserId.Value)
                };
            }
            var response = base.Query<ORG_Employee, EmployeeModel>(request, (q) =>
            {
                if (request.Data.EmployeeID != 0)
                {
                    q = q.Where(m => m.EmployeeID == request.Data.EmployeeID);
                }
                if (request.Data.EmployeeIDs != null && request.Data.EmployeeIDs.Length > 0)
                {
                    q = q.Where(m => request.Data.EmployeeIDs.Contains(m.EmployeeID));
                }
                if (!string.IsNullOrWhiteSpace(request.Data.EmpNo))
                {
                     q = q.Where(m => m.EmpNo.Contains(request.Data.EmpNo));
                }
                if (!string.IsNullOrWhiteSpace(request.Data.EmpName))
                {
                    q = q.Where(m => m.EmpName.Contains(request.Data.EmpName));
                }
                if (!string.IsNullOrWhiteSpace(request.Data.SearchWords))
                {
                    q = q.Where(m => m.EmpNo.Contains(request.Data.SearchWords) || m.EmpName.Contains(request.Data.SearchWords));
                }
                if (request.Data.JobTitle != null && request.Data.JobTitle.Length > 0 && request.Data.JobTitle[0] != null)
                {
                    q = q.Where(m => request.Data.JobTitle.Contains(m.JobTitle));
                }
                if (request.Data.OrganizationID != 0 && request.Data.OrganizationID != -1)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }
                if (!string.IsNullOrEmpty(request.Data.EmpState))
                {
                    q = q.Where(m => m.EmpState == request.Data.EmpState);
                }
                q = q.OrderByDescending(m => m.CreatedTime);
                return q;
            });
            return response;
        }

        public BaseResponse<EmployeeModel> GetEmployee(int employeeID)
        {
            return base.Get<ORG_Employee, EmployeeModel>((q) => q.EmployeeID == employeeID);
        }
        public BaseResponse<FeedbackModel> GetFeedback(int userID)
        {
            return base.Get<DC_FeedBack, FeedbackModel>((q) => q.UserID == userID);
        }
        public BaseResponse<EmployeeModel> GetEmployeeByUserID(int userID)
        {

            if (userID!=0)//依据用户Id得到员工信息
            {
                return new BaseResponse<EmployeeModel>()
                {
                    Data = GetEmployees(userID).FirstOrDefault()
                };
            }
                return new BaseResponse<EmployeeModel>()
                {
                    Data = null,
                    IsSuccess=false
                };
           
        }
        public BaseResponse<EmployeeModel> SaveEmployee(EmployeeModel request)
        {
            return base.Save<ORG_Employee, EmployeeModel>(request, (q) => q.EmployeeID == request.EmployeeID);
        }
        public BaseResponse<FeedbackModel> SaveFeedback(FeedbackModel request)
        {
            return base.Save<DC_FeedBack, FeedbackModel>(request, (q) => q.ID == request.ID);
        }
        public BaseResponse DeleteEmployee(int employeeID)
        {
            return base.Delete<ORG_Employee>(employeeID);
        }
        #endregion

        /// <summary>
        /// 依据用户Id得到员工信息
        /// </summary>
        /// <param name="userId"></param>
        /// <returns></returns>
        public IList<EmployeeModel> GetEmployees(int userId)
        {
            var emp = from m in unitOfWork.GetRepository<ORG_Employee>().dbSet
                join u in
                    unitOfWork.GetRepository<SYS_UserRelation>().dbSet.Where(o =>o.UserID==userId && o.RelationType == "UserEmployee") on
                    m.EmployeeID equals u.RelationID
                select m;
             return Mapper.DynamicMap<IList<EmployeeModel>>(emp.ToList());
        }

        public BaseResponse<UserModel> GetUserByEmployeeID(int employeeID)
        {
            var response = new BaseResponse<UserModel>();
            var user = from m in unitOfWork.GetRepository<SYS_User>().dbSet
                      join u in
                          unitOfWork.GetRepository<SYS_UserRelation>().dbSet.Where(o => o.RelationID == employeeID && o.RelationType == "UserEmployee") on
                          m.UserID equals u.UserID
                      select m;
            var rtUser = user.FirstOrDefault();
            if (rtUser!=null)
            {
                response.Data = Mapper.DynamicMap<UserModel>(rtUser);
                var r = rtUser.SYS_Role.FirstOrDefault();
                if (r != null)
                {
                    response.Data.Role = Mapper.DynamicMap<SYS_Role, RoleModel>(r);
                }
            }
            return response;
        }
    }
}
