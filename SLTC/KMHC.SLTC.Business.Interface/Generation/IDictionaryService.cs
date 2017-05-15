namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IDictionaryService : IBaseService
    {
        #region SYS_Dictionary
        /// <summary>
        /// 获取SYS_Dictionary列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DictionaryModel>> QueryDictionary(BaseRequest<DictionaryFilter> request);
        /// <summary>
        /// 获取SYS_Dictionary
        /// </summary>
        /// <param name="dictionaryID"></param>
        /// <returns></returns>
        BaseResponse<DictionaryModel> GetDictionary(int dictionaryID);
        /// <summary>
        /// 保存SYS_Dictionary
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<DictionaryModel> SaveDictionary(DictionaryModel request);
        /// <summary>
        /// 保存SYS_Dictionary
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<bool> SaveBatchDictionary(List<DictionaryModel> request);
        /// <summary>
        /// 删除SYS_Dictionary
        /// </summary>
        /// <param name="dictionaryID"></param>
        BaseResponse DeleteDictionary(int dictionaryID);
        #endregion
    }
}
