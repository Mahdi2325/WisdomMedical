namespace KMHC.SLTC.Business.Interface
{
    using KMHC.Infrastructure.Security;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IResidentService : IBaseService
    {
        #region DC_Resident
        /// <summary>
        /// 获取DC_Resident列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ResidentModel>> QueryResident(BaseRequest<ResidentFilter> request);
        BaseResponse<IList<ResidentModel>> QueryResidentByOrganizationID(int OrganizationID);
        /// <summary>
        /// 获取DC_Resident
        /// </summary>
        /// <param name="residentID"></param>
        /// <returns></returns>
        BaseResponse<ResidentModel> GetResident(int residentID);
        BaseResponse<ResidentModel> GetResidentByResidentID(int residentID, int OrganizationID);
        /// <summary>
        /// 保存DC_Resident
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<ResidentModel> SaveResident(ResidentModel request);
        /// <summary>
        /// 删除DC_Resident
        /// </summary>
        /// <param name="residentID"></param>
        BaseResponse DeleteResident(int residentID);        
        /// <summary>
        /// 会员App登录
        /// </summary>
        /// <param name="pwd"></param>
        /// <param name="name"></param>
        /// <returns></returns>
        bool Login(string name, string pwd, out ClientResidentData user); 
        BaseResponse<string> ChangePassword(string id, string newPassword, string oldPassword);
        BaseResponse GenAllQrCode();
        BaseResponse SaveSOSData(SOSFileter sos);
        BaseResponse<List<SOSDataModel>> GetSOSData(int orgId,string name);
        BaseResponse<ResidentInfoModel> GetResidentInfo(int residentID, int personID);
        #endregion
    }
}
