namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IPersonService : IBaseService
    {
        #region DC_Person
        /// <summary>
        /// 获取DC_Person列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<PersonModel>> QueryPerson(BaseRequest<PersonFilter> request);
        /// <summary>
        /// 获取DC_Person
        /// </summary>
        /// <param name="personID"></param>
        /// <returns></returns>
        BaseResponse<PersonModel> GetPerson(int personID);
        /// <summary>
        /// 保存DC_Person
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<PersonModel> SavePerson(PersonModel request);
        /// <summary>
        /// 删除DC_Person
        /// </summary>
        /// <param name="personID"></param>
        BaseResponse DeletePerson(int personID);


        bool IsExistCard(string cardId, int orgId,int? personId);

        #endregion
    }
}
