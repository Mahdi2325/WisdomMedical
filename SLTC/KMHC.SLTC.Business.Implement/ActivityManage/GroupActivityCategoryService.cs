namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    public partial class GroupActivityCategoryService : BaseService, IGroupActivityCategoryService
    {
        #region DC_GroupActivityCategory

        /// <summary>
        /// 获取团体活动类别
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public BaseResponse<IList<GroupActivityCategory>> QueryGroupActivity(BaseRequest<GroupActivityCategoryFilter> request)
        {
            BaseResponse<IList<GroupActivityCategory>> response = new BaseResponse<IList<GroupActivityCategory>>();
            var categoryItemRepository = unitOfWork.GetRepository<DC_GroupActivityItem>();
            var q = from a in unitOfWork.GetRepository<DC_GroupActivityCategory>().dbSet.Where(a => !a.IsDeleted.Value)
                    select a;

            if (request != null)
            {
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }
                if (!string.IsNullOrEmpty(request.Data.Keywords))
                {
                    q = q.Where(m => m.CategoryName.Contains(request.Data.Keywords));
                }
            }
            q = q.OrderBy(m => m.CreateTime);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<GroupActivityCategory>();
                foreach (dynamic item in list)
                {
                    var id = (int)item.ID;
                    var category = Mapper.DynamicMap<GroupActivityCategory>(item);
                    var items = categoryItemRepository.dbSet.Where(m => m.GroupActivityCategoryID == id);
                    category.GroupActivityItem = Mapper.DynamicMap<List<GroupActivityItem>>(items);
                    newList.Add(category);
                }
                response.Data = newList;
            };

            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = q.ToList();
                mapperResponse(list);
            }
            return response;
        }


        //public BaseResponse<ServiceGroupModel> GetServiceGroup(int serviceGroupID)
        //{
        //    BaseResponse<ServiceGroupModel> response = new BaseResponse<ServiceGroupModel>();
        //    var findItem = unitOfWork.GetRepository<DC_ServiceGroup>().dbSet.FirstOrDefault((q) => q.ServiceGroupID == serviceGroupID);
        //    if (findItem != null)
        //    {
        //        var serviceItemIds = findItem.DC_SerGrpSerIt.Select(it => it.ServiceItemID.Value).ToList();
        //        response.Data = Mapper.DynamicMap<ServiceGroupModel>(findItem);
        //        // 取出带总价
        //        IServiceItemService service = IOCContainer.Instance.Resolve<IServiceItemService>();
        //        var request = new BaseRequest<ServiceItemFilter>();
        //        request.Data.ServiceItemIds = serviceItemIds;
        //        var serviceItemResponse = service.QueryServiceItem(request);
        //        //response.Data.GroupItems = (List<ServiceItemModel>)serviceItemResponse.Data;
        //        // 取出数量
        //        var serviceItems = unitOfWork.GetRepository<DC_SerGrpSerIt>()
        //            .dbSet.Where(it => it.ServiceGroupID == response.Data.ServiceGroupID)
        //            .Select(it => new { it.ServiceTimes, it.ServiceItemID })
        //            .ToList();

        //        response.Data.GroupItems = new List<ServiceItemModel>();
        //        serviceItems.ForEach(it =>
        //        {
        //            var subFindItem = serviceItemResponse.Data.FirstOrDefault(sub => sub.ServiceItemID == it.ServiceItemID);
        //            if (subFindItem != null)
        //            {
        //                var newItem = Mapper.DynamicMap<ServiceItemModel>(subFindItem);
        //                newItem.ServiceTimes = it.ServiceTimes;
        //                response.Data.GroupItems.Add(newItem);
        //            }
        //        });
        //    }
        //    return response;
        //}

        //public BaseResponse<ServiceGroupModel> SaveServiceGroup(ServiceGroupModel request)
        //{
        //    var response = new BaseResponse<ServiceGroupModel>();
        //    Action<DC_ServiceGroup> SaveChildren = (parent) =>
        //    {
        //        if (request.GroupItems != null)
        //        {
        //            //var serviceItemIds = request.GroupItems.Select(it => it.ServiceItemID).ToList();
        //            //var serviceItemList = unitOfWork.GetRepository<DC_ServiceItem>().dbSet.Where(it => serviceItemIds.Contains(it.ServiceItemID)).ToList();
        //            //var oldServiceItemList = parent.DC_ServiceItem.ToList();
        //            //// 删除不存在的
        //            //oldServiceItemList.Except(serviceItemList).ToList().ForEach(it => parent.DC_ServiceItem.Remove(it));
        //            //// 添加不存在的
        //            //serviceItemList.Except(oldServiceItemList).ToList().ForEach(it => parent.DC_ServiceItem.Add(it));
        //            parent.DC_SerGrpSerIt.Clear();
        //            request.GroupItems.ForEach(item =>
        //            {
        //                var serGrpSerIt = new DC_SerGrpSerIt();
        //                serGrpSerIt.ServiceItemID = item.ServiceItemID;
        //                serGrpSerIt.ServiceTimes = item.ServiceTimes;
        //                parent.DC_SerGrpSerIt.Add(serGrpSerIt);
        //            });
        //        }
        //    };
        //    var model = unitOfWork.GetRepository<DC_ServiceGroup>().dbSet.FirstOrDefault((q) => q.ServiceGroupID == request.ServiceGroupID);
        //    if (model == null)
        //    {
        //        model = Mapper.DynamicMap<DC_ServiceGroup>(request);
        //        SaveChildren(model);
        //        unitOfWork.GetRepository<DC_ServiceGroup>().Insert(model);
        //    }
        //    else
        //    {
        //        Mapper.DynamicMap(request, model);
        //        SaveChildren(model);
        //        unitOfWork.GetRepository<DC_ServiceGroup>().Update(model);
        //    }
        //    unitOfWork.Save();
        //    Mapper.DynamicMap(model, request);
        //    response.Data = request;
        //    return response;
        //}

        public BaseResponse DeleteGroupActivityCategory(int serviceGroupID)
        {
            var response = new BaseResponse();
            var categoryRepository = unitOfWork.GetRepository<DC_GroupActivityCategory>();
            var itemRepository = unitOfWork.GetRepository<DC_GroupActivityItem>();
            var recordList = unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet.Where(a => a.CategoryID == serviceGroupID);

            unitOfWork.BeginTransaction();
            if(recordList.Count()==0)
            {
                base.Delete<DC_GroupActivityItem>(a => a.GroupActivityCategoryID == serviceGroupID);
                response = base.Delete<DC_GroupActivityCategory>(serviceGroupID);
            } else {
                var category = categoryRepository.dbSet.Where(a => a.ID == serviceGroupID).FirstOrDefault();
                category.IsDeleted = true;
                response.IsSuccess = categoryRepository.Update(category);
            }

            unitOfWork.Commit();
            return response;
        }
        #endregion
    }
}
