namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IDictionaryItemService : IBaseService
    {
        #region SYS_DictionaryItem
        /// <summary>
        /// 获取SYS_DictionaryItem列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DictionaryItemModel>> QueryDictionaryItem(BaseRequest<DictionaryItemFilter> request);


        BaseResponse<DictionaryItemModel> GetDictionary(int dictionaryItemID);
        /// <summary>
        /// 获取SYS_DictionaryItem
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<DictionaryItemModel>> GetDictionaryItems(BaseRequest<DictionaryFilter> request);
        /// <summary>
        /// 保存SYS_DictionaryItem
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<DictionaryItemModel> SaveDictionaryItem(DictionaryItemModel request);
        /// <summary>
        /// 删除SYS_DictionaryItem
        /// </summary>
        /// <param name="dictionaryItemID"></param>
        BaseResponse DeleteDictionaryItem(int dictionaryItemID);
        #endregion
    }
}
