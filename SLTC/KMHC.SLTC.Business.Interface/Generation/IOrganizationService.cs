namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IOrganizationService : IBaseService
    {
        #region ORG_Organization
        /// <summary>
        /// 获取ORG_Organization列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<OrganizationModel>> QueryOrganization(BaseRequest<OrganizationFilter> request);
        /// <summary>
        /// 获取ORG_Organization
        /// </summary>
        /// <param name="organizationID"></param>
        /// <returns></returns>
        BaseResponse<OrganizationModel> GetOrganization(int organizationID);
        /// <summary>
        /// 保存ORG_Organization
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<OrganizationModel> SaveOrganization(OrganizationModel request);
        /// <summary>
        /// 删除ORG_Organization
        /// </summary>
        /// <param name="organizationID"></param>
        BaseResponse DeleteOrganization(int organizationID);
        #endregion
    }
}
