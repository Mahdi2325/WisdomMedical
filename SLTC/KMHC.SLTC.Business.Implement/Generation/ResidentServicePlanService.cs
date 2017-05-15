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

    public partial class ResidentServicePlanService : BaseService, IResidentServicePlanService
    {
        #region DC_ResidentServicePlan
        public BaseResponse<IList<ResidentServicePlanModel>> QueryResidentServicePlan(BaseRequest<ResidentServicePlanFilter> request)
        {
            var response = new BaseResponse<IList<ResidentServicePlanModel>>();
            var q = from a in unitOfWork.GetRepository<DC_ResidentServicePlan>().dbSet
                    select a;

            if (request.Data.ResidentServicePlanID != 0)
            {
                q = q.Where(m => m.ResidentServicePlanID == request.Data.ResidentServicePlanID);
            }
            if (request.Data.ResidentId.HasValue && request.Data.ResidentId != 0)
            {
                q = q.Where(m => m.ResidentID == request.Data.ResidentId);
            }
            q = q.OrderByDescending(m => m.ResidentServicePlanID);

            if (request != null && request.PageSize > 0)
            {
                q = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize);
            }

            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.CurrentPage = request.CurrentPage;
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = Mapper.DynamicMap<IList<ResidentServicePlanModel>>(list);
            }
            else
            {
                var list = q.ToList();
                response.Data = Mapper.DynamicMap<IList<ResidentServicePlanModel>>(list);
            }

            return response;
        }

        public BaseResponse<ResidentServicePlanModel> GetResidentServicePlan(int residentServicePlanID)
        {
            var response =  base.Get<DC_ResidentServicePlan, ResidentServicePlanModel>((q) => q.ResidentServicePlanID == residentServicePlanID);
            if (response.Data !=null)
            {
                var itemList = unitOfWork.GetRepository<DC_ResidentServicePlanItem>().dbSet.Where(a => a.ResidentServicePlanID == residentServicePlanID).ToList();
                if (itemList.Any())
                {
                    response.Data.GroupItems = Mapper.DynamicMap<List<DC_ResidentServicePlanItem>, List<ResidentServicePlanItemModel>>(itemList);
                }
            }
            return response;
        }

        public BaseResponse SaveResidentServicePlan(ServiceGroupOrderModel request)
        {
            BaseResponse response = new BaseResponse();
            var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
            var serviceGroupRepository = unitOfWork.GetRepository<DC_ServiceGroup>();
            var serviceOrderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var residentServicePlanRepository = unitOfWork.GetRepository<DC_ResidentServicePlan>();
            var residentServicePlanItemRepository = unitOfWork.GetRepository<DC_ResidentServicePlanItem>();
            var feeDetailRepository = unitOfWork.GetRepository<DC_FeeDetail>();
            IServiceGroupService grpService = KM.Common.IOCContainer.Instance.Resolve<IServiceGroupService>();

            var serviceGroup = grpService.GetServiceGroup(request.ServiceGroupID);

            var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == request.ResidentID);
            if (serviceGroup.Data.SumPrice > 0)
            {
                if (deposit != null)
                {
                    var remainingMoney = deposit.Amount - deposit.TotalConSpeMonth;
                    if (serviceGroup.Data.SumPrice > remainingMoney)
                    {
                        response.IsSuccess = false;
                    }
                }
                else
                {
                    response.IsSuccess = false;
                }
            }

            if (!response.IsSuccess)
            {
                response.ResultMessage = "账户期初余额不足，请充值后完成操作";
                return response;
            }

            unitOfWork.BeginTransaction();
            // 扣钱
            if (serviceGroup.Data.SumPrice > 0)
            {
                deposit.TotalConSpeMonth = deposit.TotalConSpeMonth + serviceGroup.Data.SumPrice;
                depositRepository.Update(deposit);
            }

            if (serviceGroup.Data != null && serviceGroup.Data.GroupItems != null)
            {
                var residentServicePlan = new DC_ResidentServicePlan();
                residentServicePlan.ResidentID = request.ResidentID;
                residentServicePlan.ServiceGroupID = serviceGroup.Data.ServiceGroupID;
                residentServicePlan.SGNo = serviceGroup.Data.SGNo;
                residentServicePlan.SGName = serviceGroup.Data.SGName;
                residentServicePlan.SumPrice = serviceGroup.Data.SumPrice;
                residentServicePlan.Remark = serviceGroup.Data.Remark;
                residentServicePlan.Description = serviceGroup.Data.Description;
                residentServicePlan.SStartDate = DateTime.Now;
                if (serviceGroup.Data.ExpiryDate.HasValue)
                {
                    if (serviceGroup.Data.ExpiryUnit == Enum.GetName(typeof(EnumPeriod), EnumPeriod.Day))
                    {
                        residentServicePlan.SEndDate = DateTime.Now.AddDays(serviceGroup.Data.ExpiryDate.Value);
                    }
                    else
                    {
                        residentServicePlan.SEndDate = DateTime.Now.AddMonths(serviceGroup.Data.ExpiryDate.Value);
                    }
                }
                else
                {
                    residentServicePlan.SEndDate = DateTime.Now.AddMonths(1200);
                }
                residentServicePlan.CreatedTime = DateTime.Now;
                residentServicePlan.ModifiedTime = DateTime.Now;
                serviceGroup.Data.GroupItems.ForEach(it => {
                    var residentServicePlanItem = new DC_ResidentServicePlanItem();
                    residentServicePlanItem.ServiceItemID = it.ServiceItemID;
                    residentServicePlanItem.SINo = it.SINo;
                    residentServicePlanItem.SIName = it.SIName;
                    residentServicePlanItem.SIType = it.SIType;
                    residentServicePlanItem.ServiceTimes = it.ServiceTimes.Value;
                    residentServicePlanItem.RestTimes = it.ServiceTimes.Value;
                    residentServicePlanItem.Remark = it.Remark;
                    residentServicePlanItem.CreatedTime = DateTime.Now;
                    residentServicePlanItem.ModifiedTime = DateTime.Now;
                    residentServicePlan.DC_ResidentServicePlanItem.Add(residentServicePlanItem);
                });

                residentServicePlanRepository.Insert(residentServicePlan);

                var feeDetail =new DC_FeeDetail();
                feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, serviceGroup.Data.OrganizationID);
                feeDetail.FeeName = serviceGroup.Data.SGName;
                feeDetail.TotalPrice = -serviceGroup.Data.SumPrice;
                feeDetail.FeeDate = DateTime.Now;
                feeDetail.ResidentID = request.ResidentID;
                feeDetailRepository.Insert(feeDetail);
            }
            unitOfWork.Commit();
            return response;
        }

        public BaseResponse DeleteResidentServicePlan(int residentServicePlanID)
        {
            return base.Delete<DC_ResidentServicePlan>(residentServicePlanID);
        }
        #endregion
    }
}
