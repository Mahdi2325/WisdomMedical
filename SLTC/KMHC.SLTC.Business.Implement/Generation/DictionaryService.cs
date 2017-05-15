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
    
    public partial class DictionaryService : BaseService, IDictionaryService
    {
        #region SYS_Dictionary
        public BaseResponse<IList<DictionaryModel>> QueryDictionary(BaseRequest<DictionaryFilter> request)
        {
            var response = base.Query<SYS_Dictionary, DictionaryModel>(request, (q) =>
            {
                q = q.Where(o => o.IsDeleted == false);
                if (!string.IsNullOrEmpty(request.Data.KeyWords))
                {
                    q = q.Where(m => m.ItemType.Contains(request.Data.KeyWords) || m.TypeName.Contains(request.Data.KeyWords));
                }
                if (!string.IsNullOrEmpty(request.Data.ItemType))
                {
                    q = q.Where(m => m.ItemType == request.Data.ItemType);
                }
                q = q.OrderBy(m => m.DictionaryID);
                return q;
            });
            return response;
        }

        public BaseResponse<DictionaryModel> GetDictionary(int dictionaryID)
        {
            return base.Get<SYS_Dictionary, DictionaryModel>((q) => q.DictionaryID == dictionaryID);
        }

        public BaseResponse<DictionaryModel> SaveDictionary(DictionaryModel request)
        {
            return base.Save<SYS_Dictionary, DictionaryModel>(request, (q) => q.DictionaryID == request.DictionaryID);
        }

        public BaseResponse DeleteDictionary(int dictionaryID)
        {
            return base.Delete<SYS_Dictionary>(dictionaryID);
        }
        #endregion

        public BaseResponse<bool> SaveBatchDictionary(List<DictionaryModel> request)
        {
            BaseResponse<bool> response = new BaseResponse<bool>();
            var dictionaryRepository = unitOfWork.GetRepository<SYS_Dictionary>();
            var dictionaryItemRepository = unitOfWork.GetRepository<SYS_DictionaryItem>();
            foreach (var item in request) {
                SYS_Dictionary dictionary = Mapper.DynamicMap<SYS_Dictionary>(item);
                dictionaryRepository.Insert(dictionary);
                unitOfWork.Save();
                foreach (var sub in item.Items) {
                    SYS_DictionaryItem dictionaryItem = Mapper.DynamicMap<SYS_DictionaryItem>(sub);
                    dictionaryItem.DictionaryID = dictionary.DictionaryID;
                    dictionaryItemRepository.Insert(dictionaryItem);
                }
            }
            unitOfWork.Save();
            return response;
        }
    }
}
