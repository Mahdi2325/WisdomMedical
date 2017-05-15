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

    public partial class DepositService : BaseService, IDepositService
    {
        #region DC_Deposit
        public BaseResponse<IList<DepositModel>> QueryDeposit(BaseRequest<DepositFilter> request)
        {
            var response = base.Query<DC_Deposit, DepositModel>(request, (q) =>
            {
                if (request.Data.DepositID != 0)
                {
                    q = q.Where(m => m.DepositID == request.Data.DepositID);
                }
                q = q.OrderByDescending(m => m.CreatedTime);
                return q;
            });
            return response;
        }

        public BaseResponse<DepositModel> GetDeposit(int residentID)
        {
            return base.Get<DC_Deposit, DepositModel>((q) => q.ResidentID == residentID);
        }

        public BaseResponse<DepositModel> SaveDeposit(DepositModel request)
        {
            BaseResponse<DepositModel> resdeposit = new BaseResponse<DepositModel>();
            if (request.ResidentID == 0)
            {
                resdeposit.ResultMessage = "会员ID不能为空";
                resdeposit.IsSuccess = false;
                return resdeposit;
            }
            if (request.ResidentID != 0)
            {
                unitOfWork.BeginTransaction();
                var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
                var paymentRepository = unitOfWork.GetRepository<DC_Payment>();

                request.DepositNo = GenerateCode(EnumCodeKey.DepositCode, EnumCodeRule.YearMonthDay, "D", 4, request.OrganizationID);
                bool flag = false;
                var model = depositRepository.dbSet.FirstOrDefault(q => q.ResidentID == request.ResidentID);
                if (model != null)
                {
                    //更新
                    model.Amount = model.Amount + request.Amount;
                    var depmodel = Mapper.DynamicMap<DC_Deposit>(model);
                    flag = depositRepository.Update(depmodel);
                }
                else
                {
                    //新增
                    var depmodel = Mapper.DynamicMap<DC_Deposit>(request);
                    flag = depositRepository.Insert(depmodel);
                }
                if (flag)
                {
                    PaymentModel pm = new PaymentModel();
                    pm.PaymentNo = GenerateCode(EnumCodeKey.PaymentCode, EnumCodeRule.YearMonthDay, "P", 4, request.OrganizationID);
                    pm.ResidentID = request.ResidentID;
                    pm.Amount = request.Amount;
                    pm.PayDate = request.DepositDate;
                    pm.Payee = request.Payee;
                    pm.InvoiceNo = request.InvoiceNo;
                    pm.PayType = PayType.Pay.ToString();
                    pm.PayMethod = request.PayMethod;
                    pm.Remark = request.Remark;
                    var p = Mapper.DynamicMap<DC_Payment>(pm);
                    flag = paymentRepository.Insert(p);

                    if (flag)
                    {
                        //资金明细
                        var feeDetail = new DC_FeeDetail();
                        feeDetail.FeeNo = base.GenerateCode(EnumCodeKey.FeeDetailCode, EnumCodeRule.YearMonthDay, "F", 6, request.OrganizationID);
                        feeDetail.FeeName = "充值";
                        feeDetail.TotalPrice = request.Amount;
                        feeDetail.ResidentID = request.ResidentID.Value;
                        feeDetail.FeeDate = DateTime.Now;
                        unitOfWork.GetRepository<DC_FeeDetail>().Insert(feeDetail);
                    }
                }
                if (!flag)
                {
                    resdeposit.ResultMessage = "预存款保存失败";
                    resdeposit.IsSuccess = false;
                }
                else
                {
                    unitOfWork.Commit();
                }
            }
            return resdeposit;


        }

        public BaseResponse DeleteDeposit(int depositID)
        {
            return base.Delete<DC_Deposit>(depositID);
        }



        #endregion
    }
}
