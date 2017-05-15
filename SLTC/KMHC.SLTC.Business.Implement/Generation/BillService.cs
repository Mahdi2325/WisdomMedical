namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.Infrastructure;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections.Generic;
    using System.Linq;

    public partial class BillService : BaseService, IBillService
    {
        #region DC_Bill
        public BaseResponse<IList<BillModel>> QueryBill(BaseRequest<BillFilter> request)
        {
            var response = base.Query<DC_Bill, BillModel>(request, (q) =>
            {
                if (request.Data.BillID != 0)
                {
                    q = q.Where(m => m.BillID == request.Data.BillID);
                }
                if (request.Data.BillDateFrom.HasValue)
                {
                    q = q.Where(m => m.BillDate >= request.Data.BillDateFrom.Value);
                }
                if (request.Data.BillDateTo.HasValue)
                {
                    request.Data.BillDateTo = request.Data.BillDateTo.Value.AddDays(1);
                    q = q.Where(m => m.BillDate < request.Data.BillDateTo.Value);
                }
                q = q.Where(m => m.ResidentID == request.Data.ResidentID);
                q = q.OrderByDescending(m => m.BillDate);
                return q;
            });
            return response;
        }

        public BaseResponse<BillModel> GetBill(int billID)
        {
            return base.Get<DC_Bill, BillModel>((q) => q.BillID == billID);
        }

        public BaseResponse<BillModel> SaveBill(BillModel request)
        {
            request.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            //1.费用明细里统计总额 FeeDetail
            //2.往账单表插入数据 Bill
            //3.账户里面的扣金额 Deposit
            //4.缴费记录加一条缴费记录 payment
            //5.然后标志费用的数据改为已经支付
            BaseResponse<BillModel> ResponeBm = new BaseResponse<BillModel>();
            try
            {
                if (request.ResidentID == 0)
                {
                    ResponeBm.ResultMessage = "会员ID不能为空";
                    ResponeBm.IsSuccess = false;
                    return ResponeBm;
                }
                unitOfWork.BeginTransaction();
                var feeDetailRepository = unitOfWork.GetRepository<DC_FeeDetail>();
                var billRepository = unitOfWork.GetRepository<DC_Bill>();
                var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
                var paymentRepository = unitOfWork.GetRepository<DC_Payment>();

                //费用明细里统计总额
                decimal summoney = 0;
                var data = (from s in feeDetailRepository.dbSet
                            where s.ResidentID == request.ResidentID && s.IsPay == false && !s.IsDeleted
                            select s.TotalPrice);
                if (data.Count() != 0)
                {
                    summoney = data.Sum(a=>a.Value);
                }
                else
                {
                    ResponeBm.ResultMessage = "暂无账单";
                    ResponeBm.IsSuccess = false;
                    return ResponeBm;
                }

                request.BillNo = GenerateCode(EnumCodeKey.BillCode, EnumCodeRule.YearMonthDay, "B", 4, request.OrganizationID);
                request.TotalCpAmount = summoney;
                request.BillContent = "手动生成";
                request.BillDate = DateTime.Now;
                request.BillStatus = "1";
                //往账单表插入数据 Bill
                var billmodel = Mapper.DynamicMap<DC_Bill>(request);
                billmodel.BillID = int.Parse(base.GeneratePrimaryKeyValue(EnumCodeKey.Bill));//生成id
                bool flag = billRepository.Insert(billmodel);
                if (flag && billmodel != null)
                {
                    var depositModel = depositRepository.dbSet.FirstOrDefault((q) => q.ResidentID == request.ResidentID);
                    if (depositModel != null)
                    {
                        decimal total = depositModel.TotalConSpeMonth;
                        depositModel.Amount = depositModel.Amount - depositModel.TotalConSpeMonth;
                        depositModel.TotalConSpeMonth = 0;
                        //账户里面的扣金额 Deposit                 
                        flag = depositRepository.Update(depositModel);
                        if (flag)
                        {
                            //缴费记录加一条缴费记录
                            PaymentModel paymentModel = new PaymentModel()
                            {
                                ResidentID = request.ResidentID,
                                PaymentNo = "P" + CreateNo(),
                                Amount = total,
                                PayType = PayType.Bill.ToString(),
                                PayDate = DateTime.Now
                            };
                            var pm = Mapper.DynamicMap<DC_Payment>(paymentModel);
                            flag = paymentRepository.Insert(pm);
                            if (flag)
                            {
                                BaseRequest<PaymentFilter> payfilter = new BaseRequest<PaymentFilter>()
                                {
                                    CurrentPage = 1,
                                    PageSize = 1000
                                };
                                var feeDetailRes = base.Query<DC_FeeDetail, FeeDetailModel>(payfilter, (q) =>
                                {
                                    q = q.Where(m => m.ResidentID == request.ResidentID && m.IsPay == false);
                                    q = q.OrderBy(m => m.FeeDetailID);
                                    return q;
                                });
                                if (feeDetailRes != null && feeDetailRes.Data != null)
                                {
                                    foreach (var item in feeDetailRes.Data)
                                    {
                                        var feedetail = feeDetailRepository.dbSet.FirstOrDefault((q) => q.FeeDetailID == item.FeeDetailID);
                                        if (feedetail != null)
                                        {
                                            feedetail.IsPay = true;
                                            feedetail.IsProduceBill = true;
                                            feedetail.BillID = billmodel.BillID;
                                            flag = feeDetailRepository.Update(feedetail);
                                        }
                                    }

                                }
                            }
                        }
                    }
                }
                if (flag)
                {
                    unitOfWork.Commit();
                }
                else
                {
                    ResponeBm.ResultMessage = "账单生成失败";
                    ResponeBm.IsSuccess = false;
                }
            }
            catch (Exception ex)
            {
                ResponeBm.ResultMessage = "账单生成异常，请联系管理员";
                ResponeBm.IsSuccess = false;
            }

            return ResponeBm;
        }

        public BaseResponse DeleteBill(int billID)
        {
            return base.Delete<DC_Bill>(billID);
        }
        #endregion
    }
}
