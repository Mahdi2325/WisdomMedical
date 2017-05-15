namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IEmployeeService : IBaseService
    {
        #region ORG_Employee
        /// <summary>
        /// 获取ORG_Employee列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<EmployeeModel>> QueryEmployee(BaseRequest<EmployeeFilter> request);
        /// <summary>
        /// 获取ORG_Employee
        /// </summary>
        /// <param name="employeeID"></param>
        /// <returns></returns>
        BaseResponse<EmployeeModel> GetEmployee(int employeeID);
        BaseResponse<FeedbackModel> GetFeedback(int userID);
        BaseResponse<EmployeeModel> GetEmployeeByUserID(int userID);
        /// <summary>
        /// 保存ORG_Employee
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<EmployeeModel> SaveEmployee(EmployeeModel request);
        BaseResponse<FeedbackModel> SaveFeedback(FeedbackModel request);
        /// <summary>
        /// 删除ORG_Employee
        /// </summary>
        /// <param name="employeeID"></param>
        BaseResponse DeleteEmployee(int employeeID);
        BaseResponse<UserModel> GetUserByEmployeeID(int employeeID);
        #endregion
    }
}
