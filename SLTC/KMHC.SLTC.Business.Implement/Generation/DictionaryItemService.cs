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
    
    public partial class DictionaryItemService : BaseService, IDictionaryItemService
    {
        #region SYS_DictionaryItem
        public BaseResponse<IList<DictionaryItemModel>> QueryDictionaryItem(BaseRequest<DictionaryItemFilter> request)
        {
            //Mapper.CreateMap<SYS_DictionaryItem, DictionaryItemModel>();
            //.ForMember(d=>d.Name, opt=>opt.MapFrom(s=>s.ITEMNAME))
            //.ForMember(d=>d.Value, opt=>opt.MapFrom(s=>s.ITEMCODE))
            //.ForMember(d=>d.Parent, opt=>opt.MapFrom(s=>s.ITEMTYPE));
            var response = new BaseResponse<IList<DictionaryItemModel>>();

            var q = from di in unitOfWork.GetRepository<SYS_DictionaryItem>().dbSet
                    join d in unitOfWork.GetRepository<SYS_Dictionary>().dbSet on di.DictionaryID equals d.DictionaryID
                    select new DictionaryItemModel
                    {
                        DictionaryItemID = di.DictionaryItemID,
                        DictionaryID = di.DictionaryID,
                        ItemCode = di.ItemCode,
                        ItemName = di.ItemName,
                        OrderSeq = di.OrderSeq,
                        Description = di.Description,
                        CreatedBy = di.CreatedBy,
                        CreatedTime = di.CreatedTime,
                        ModifiedBy = di.ModifiedBy,
                        ModifiedTime = di.ModifiedTime,
                        IsDeleted = di.IsDeleted,
                        ItemType = d.ItemType
                    };

            if (request.Data.DictionaryItemID != 0)
            {
                q = q.Where(m => m.DictionaryItemID == request.Data.DictionaryItemID);
            }
            if (!string.IsNullOrEmpty(request.Data.ItemType))
            {
                q = q.Where(m => m.ItemType == request.Data.ItemType);
            }
            else if (request.Data.ItemTypes != null)
            {
                q = q.Where(m => request.Data.ItemTypes.Contains(m.ItemType));
            }
            q = q.OrderBy(m => m.OrderSeq);
            response.Data = Mapper.DynamicMap<IList<DictionaryItemModel>>(q.ToList());
            return response;
        }

        public BaseResponse<DictionaryItemModel> GetDictionary(int dictionaryItemID)
        {
            return base.Get<SYS_DictionaryItem, DictionaryItemModel>((q) => q.DictionaryItemID == dictionaryItemID);
        }

        public BaseResponse<IList<DictionaryItemModel>> GetDictionaryItems(BaseRequest<DictionaryFilter> request)
        {
            var response = Query<SYS_DictionaryItem, DictionaryItemModel>(request, (q) =>
            {
                q = q.Where(m => m.DictionaryID == request.Data.DictionaryID);
                q = q.OrderByDescending(m => m.DictionaryItemID);
                return q;
            });
            return response;
        }

        public BaseResponse<DictionaryItemModel> SaveDictionaryItem(DictionaryItemModel request)
        {
            return base.Save<SYS_DictionaryItem, DictionaryItemModel>(request, (q) => q.DictionaryItemID == request.DictionaryItemID);
        }

        public BaseResponse DeleteDictionaryItem(int dictionaryItemID)
        {
            return base.Delete<SYS_DictionaryItem>(dictionaryItemID);
        }
        #endregion
    }
}
