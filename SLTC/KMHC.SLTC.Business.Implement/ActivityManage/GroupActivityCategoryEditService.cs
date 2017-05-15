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
    using KM.Common;

    public partial class GroupActivityCategoryEditService : BaseService, IGroupActivityCategoryEditService
    {
        #region DC_GroupActivityCategory
        public BaseResponse<IList<GroupActivityCategory>> QueryGroupActivity(BaseRequest<GroupActivityCategoryFilter> request)
        {
            var response = new BaseResponse<IList<GroupActivityCategory>>();
            var q = from m in unitOfWork.GetRepository<DC_GroupActivityCategory>().dbSet
                    select m;
            q = q.OrderBy(m => m.ID);
            List<DC_GroupActivityCategory> list = q.ToList();
            var data = new List<GroupActivityCategory>();
            var groupActivityCategory = new GroupActivityCategory();
            foreach (var item in list)
            {
                groupActivityCategory.ID = item.ID;
                groupActivityCategory.CategoryName = item.CategoryName;
                groupActivityCategory.Remark = item.Remark;
                groupActivityCategory.IsDeleted = item.IsDeleted.Value;
                groupActivityCategory.GroupActivityItem = Mapper.DynamicMap<List<GroupActivityItem>>(item.DC_GroupActivityItem);
                data.Add(groupActivityCategory);
                groupActivityCategory = new GroupActivityCategory();
            }
            response.Data = data;
            return response;
        }

        public BaseResponse<GroupActivityCategory> GetGroupActivityCategory(int ID)
        {
            var response = new BaseResponse<GroupActivityCategory>();
            DC_GroupActivityCategory _groupActivityCategory = unitOfWork.GetRepository<DC_GroupActivityCategory>().Get(ID); 
            _groupActivityCategory.DC_GroupActivityItem = _groupActivityCategory.DC_GroupActivityItem.Where(a=>!(a.IsDelete??false)).ToList();
            var groupActivityCategory = Mapper.DynamicMap<GroupActivityCategory>(_groupActivityCategory);
            groupActivityCategory.GroupActivityItem = Mapper.DynamicMap<List<GroupActivityItem>>(_groupActivityCategory.DC_GroupActivityItem); 
            response.Data = groupActivityCategory;
            return response;
        }

        public BaseResponse<GroupActivityCategory> SaveGroupActivityCategory(GroupActivityCategory request)
        {
            //var response = new BaseResponse<GroupActivityCategory>();
            //var categoryRepository = unitOfWork.GetRepository<DC_GroupActivityCategory>();
            //var categoryItemRepository = unitOfWork.GetRepository<DC_GroupActivityItem>();

            //unitOfWork.BeginTransaction();
            //var model = categoryRepository.dbSet.FirstOrDefault((q) => q.ID == request.ID);
            //if (model == null)
            //{
            //    model = Mapper.DynamicMap<DC_GroupActivityCategory>(request);
            //    categoryRepository.Insert(model);
            //}
            //else
            //{
            //    Mapper.DynamicMap(request, model);
            //    if (model.DC_GroupActivityItem!=null)
            //    {
            //        foreach (var item in model.DC_GroupActivityItem)
            //        {
            //            if (item.ID !=0)
            //            {
            //                categoryItemRepository.Update(item);
            //            }
            //            else
            //            {
            //                categoryItemRepository.Insert(item);
            //            }
            //        }
            //    }
            //    model.DC_GroupActivityItem.Clear();
            //    categoryRepository.Update(model);
            //}
            //unitOfWork.Commit();
            //Mapper.DynamicMap(model, request);
            //response.Data = request;
            //return response;

            var response = new BaseResponse<GroupActivityCategory>();
            Action<DC_GroupActivityCategory> SaveChildren = (parent) =>
            {
                if (request.GroupActivityItem != null)
                {
                    var serviceItemIds = request.GroupActivityItem.Select(it => it.ID).ToList();
                    var oldServiceItemIds = parent.DC_GroupActivityItem.Select(it => it.ID).ToList();
                    var serviceItemList = unitOfWork.GetRepository<DC_GroupActivityItem>().dbSet.Where(it => serviceItemIds.Contains(it.ID)).ToList();
                    var oldServiceItemList = parent.DC_GroupActivityItem.ToList();
                    //更新存在的
                    oldServiceItemIds.Intersect(serviceItemIds).ToList().ForEach(it =>
                    {
                        var oldItem = oldServiceItemList.Where(a => a.ID == it).FirstOrDefault();
                        var newItem = request.GroupActivityItem.Where(a=>a.ID==it).FirstOrDefault();
                        if (oldItem != null && newItem!=null)
                        {
                            oldItem.ItemName = newItem.ItemName;
                            oldItem.Remark = newItem.Remark;
                        }
                    });

                    // 删除不存在的
                    oldServiceItemList.Except(serviceItemList).ToList().ForEach(it => parent.DC_GroupActivityItem.Remove(it));
                    // 添加不存在的
                    serviceItemList.Except(oldServiceItemList).ToList().ForEach(it => parent.DC_GroupActivityItem.Add(it));
                }
            };
            var model = unitOfWork.GetRepository<DC_GroupActivityCategory>().dbSet.FirstOrDefault((q) => q.ID == request.ID);
            if (model == null)
            {
                model = Mapper.DynamicMap<DC_GroupActivityCategory>(request);
                unitOfWork.GetRepository<DC_GroupActivityCategory>().Insert(model);
            }
            else
            {
                SaveChildren(model);
                model.CategoryName = request.CategoryName;
                model.Remark =  request.Remark;
                unitOfWork.GetRepository<DC_GroupActivityCategory>().Update(model);
            }
            unitOfWork.Save();
            Mapper.DynamicMap(model, request);
            response.Data = request;
            return response;
        }

        public BaseResponse DeleteGroupActivityCategory(int ID)
        {
            return base.Delete<DC_GroupActivityCategory>(ID);
        }
        public BaseResponse SaveActivityItems(IList<GroupActivityItem> request)
        {
            BaseResponse respone = new BaseResponse();
            var categoryItemRepository = unitOfWork.GetRepository<DC_GroupActivityItem>();
            unitOfWork.BeginTransaction();
            foreach(GroupActivityItem rqItem in request){
                if (rqItem.ID==0)
                {
                    var item = Mapper.DynamicMap<DC_GroupActivityItem>(rqItem);
                    categoryItemRepository.Insert(item);
                } else {
                    var item = categoryItemRepository.Get(rqItem.ID);
                    if (item!=null)
                    {
                        if (rqItem.Action == "Delete")
                        {
                            var recordList = unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet.Where(a => a.ItemID == rqItem.ID);
                            if(recordList.Count()==0)
                            {
                                categoryItemRepository.Delete(item);
                            } else
                            {
                                item.GroupActivityCategoryID = rqItem.GroupactivitycategoryID;
                                item.IsDelete = true;
                                categoryItemRepository.Update(item);                            
                            }
                        }
                        else
                        {
                            item.GroupActivityCategoryID = rqItem.GroupactivitycategoryID;
                            item.ItemName = rqItem.ItemName;
                            item.Remark = rqItem.Remark;
                            categoryItemRepository.Update(item);
                        }
                    }
                }
            }
            unitOfWork.Commit();
            return respone;
        }
        #endregion
    }
}
