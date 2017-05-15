using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Persistence;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model.FinancialManagement;
using KMHC.Infrastructure;
using AutoMapper;
using System.Collections;
using KM.Common;

namespace KMHC.SLTC.Business.Implement
{
    public class PaymentsService : BaseService, IPaymentsService
    {
        IComOrderService service = IOCContainer.Instance.Resolve<IComOrderService>();
        public BaseResponse<IList<SerOrdSerItModel>> GetServiceOrderByRsID(BaseRequest<PaymentsFilter> request)
        {
            BaseResponse<IList<SerOrdSerItModel>> response = new BaseResponse<IList<SerOrdSerItModel>>();
            var orderdata = (from a in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                             join b in unitOfWork.GetRepository<ORG_Employee>().dbSet on a.OrderCreator equals b.EmployeeID
                             join c in unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet on a.ServiceOrderID equals c.ServiceOrderID
                             join d in unitOfWork.GetRepository<DC_ServiceItem>().dbSet on c.ServiceItemID equals d.ServiceItemID
                             join e in unitOfWork.GetRepository<DC_PNC>().dbSet on a.PNCID equals e.PNCID
                             where a.IsDeleted == false && a.IsCancelFlag==false 
                             && a.ResidentID == request.Data.ResidentID && a.ServiceType == 2 && c.ChargeStatus == 0 
                             orderby a.CreatedTime descending
                             select new SerOrdSerItModel()
                            {
                                ServiceOrderSIID=c.ServiceOrderSIID,
                                ServiceOrderID = c.ServiceOrderID,
                                ServiceItemID = c.ServiceItemID,
                                ResidentServicePlanItemID=c.ResidentServicePlanItemID,
                                SONo = a.SONo,
                                PNCID=e.PNCID,
                                PNCName=e.PNCName,
                                CreatedTime=a.CreatedTime,
                                Otime = a.Otime,
                                EmpName = b.EmpName,
                                SINo = c.SINo,
                                SIName = c.SIName,
                                UnitName = d.UnitName,
                                UnitPrice = c.UnitPrice,
                                Qty = c.Qty,
                                DiscountPrice = c.DiscountPrice,
                                SumPrice = c.SumPrice
                            }).ToList();
            response.Data = orderdata;
            return response;
        }

        public BaseResponse<DepositModel> GetPreHasAmountByRsID(int residentID)
        {
            return base.Get<DC_Deposit, DepositModel>((q) => q.ResidentID == residentID && q.IsDeleted == false);
        }

        public BaseResponse<IList<SerOrdSerItModel>> SavePaymentByRsId(SerOrdSerItModelList baseRequest)
        {
            BaseResponse<IList<SerOrdSerItModel>> response = new BaseResponse<IList<SerOrdSerItModel>>();
            SerOrdSerItModelList sosiml = new SerOrdSerItModelList();
            DateTime dtnow = DateTime.Now;
            decimal preamount = 0;
            try
            {
                unitOfWork.BeginTransaction();
                if (baseRequest.SerOrdSerItModelLists != null && baseRequest.PaymentInfos != null)
                {
                    #region 订单服务记录
                    foreach (var item in baseRequest.SerOrdSerItModelLists)
                    {
                        PaymentsServiceOrderModel psom = new PaymentsServiceOrderModel();
                        var serorderserit = unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(m => m.ServiceOrderSIID==item.ServiceOrderSIID).ToList();
                        if (serorderserit != null)
                        {
                            if (serorderserit.Count > 0)
                            {
                                //订单服务关联
                                serorderserit[0].ChargeStatus = 1;
                                serorderserit[0].ModifiedBy = SecurityHelper.CurrentPrincipal.EmpId;
                                serorderserit[0].ModifiedTime = dtnow;
                                unitOfWork.GetRepository<DC_SerOrdSerIt>().Update(serorderserit[0]);
                            }
                        }

                        if (item.ResidentServicePlanItemID != 0 && item.ResidentServicePlanItemID != null)
                        {
                            var dc_rspi = unitOfWork.GetRepository<DC_ResidentServicePlanItem>().dbSet.Where(m => m.ResidentServicePlanItemID == item.ResidentServicePlanItemID).ToList();

                            if (dc_rspi != null)
                            {
                                if (dc_rspi.Count > 0)
                                {
                                    //套餐表
                                    dc_rspi[0].RestTimes = dc_rspi[0].RestTimes - (int)item.Qty;
                                    dc_rspi[0].ModifiedBy = SecurityHelper.CurrentPrincipal.EmpId;
                                    dc_rspi[0].ModifiedTime = dtnow;
                                    unitOfWork.GetRepository<DC_ResidentServicePlanItem>().Update(dc_rspi[0]);
                                }
                            }
                        }

                        psom.ServiceOrderID = item.ServiceOrderID;
                        psom.SumPrice = item.SumPrice;
                        sosiml.PaymentsServiceOrderModelLists.Add(psom);
                    }

                    var deposit = unitOfWork.GetRepository<DC_Deposit>().dbSet.Where(m => m.ResidentID == baseRequest.PaymentInfos.ResidentID).ToList();
                    if (deposit != null)
                    {
                        if (deposit.Count > 0)
                        {
                            //更新预收款余额表
                            preamount = deposit[0].Amount;
                            deposit[0].Amount = deposit[0].Amount - baseRequest.PaymentInfos.PreAmount;
                            deposit[0].TotalConSpeMonth = deposit[0].TotalConSpeMonth + baseRequest.PaymentInfos.PreAmount;
                            deposit[0].ModifiedBy = SecurityHelper.CurrentPrincipal.EmpId;
                            deposit[0].ModifiedTime = dtnow;
                            unitOfWork.GetRepository<DC_Deposit>().Update(deposit[0]);
                        }
                    }
                    var ls = sosiml.PaymentsServiceOrderModelLists.GroupBy(a => a.ServiceOrderID).Select(g => (new { ServiceOrderID = g.Key, SumPrice = g.Sum(item => item.SumPrice) })).ToList();

                    foreach (var psoml in ls)
                    {
                        var serviceorderchargerecid = String.Format("{0}{1}{2}", "C", SecurityHelper.CurrentPrincipal.OrgId, DateTime.Now.ToString("yyyyMMddHHmmss"));
                        //服务订单收费记录表
                        DC_ServiceOrderCharge serviceordercharge = new DC_ServiceOrderCharge();
                        serviceordercharge.ServiceOrderChargeRecId = serviceorderchargerecid;
                        serviceordercharge.ServiceOrderID = psoml.ServiceOrderID;
                        serviceordercharge.Price = psoml.SumPrice;
                        serviceordercharge.Payer = baseRequest.PaymentInfos.Payer;
                        serviceordercharge.FrontPreAmount = preamount;
                        serviceordercharge.PreAmount = baseRequest.PaymentInfos.PreAmount;
                        serviceordercharge.ReceiveAmount = baseRequest.PaymentInfos.CurAmount;
                        serviceordercharge.PaymentType = baseRequest.PaymentInfos.PaymentType;
                        serviceordercharge.PayTime = dtnow;
                        serviceordercharge.InvoiceNo = baseRequest.PaymentInfos.InvoiceNo;
                        serviceordercharge.ChargeStatus = 1;
                        serviceordercharge.Operator = SecurityHelper.CurrentPrincipal.EmpId;
                        serviceordercharge.CreatedBy = SecurityHelper.CurrentPrincipal.EmpId;
                        serviceordercharge.CreatedTime = dtnow;
                        serviceordercharge.IsDeleted = false;

                        var dc_soc = unitOfWork.GetRepository<DC_ServiceOrderCharge>().dbSet.Where(m => m.ServiceOrderChargeRecId == serviceorderchargerecid).ToList();
                        if (dc_soc.Count > 0)
                        {
                            unitOfWork.GetRepository<DC_ServiceOrderCharge>().Update(serviceordercharge);
                        }
                        else
                        {
                            unitOfWork.GetRepository<DC_ServiceOrderCharge>().Insert(serviceordercharge);
                        }

                        foreach (var sosml in baseRequest.SerOrdSerItModelLists)
                        {
                            if (sosml.ServiceOrderID == psoml.ServiceOrderID)
                            {
                                //订单收费明细
                                DC_ServiceOrderChargeDtl dc_serviceorderchargedtl = new DC_ServiceOrderChargeDtl();
                                dc_serviceorderchargedtl.ServiceOrderChargeRecId = serviceorderchargerecid;
                                dc_serviceorderchargedtl.ServiceOrderID = sosml.ServiceOrderID;
                                dc_serviceorderchargedtl.ServiceItemID = sosml.ServiceItemID;
                                dc_serviceorderchargedtl.UnitPrice = sosml.UnitPrice;
                                dc_serviceorderchargedtl.Qty = sosml.Qty;
                                dc_serviceorderchargedtl.DiscountPrice = sosml.DiscountPrice;
                                dc_serviceorderchargedtl.SumPrice = sosml.SumPrice;
                                dc_serviceorderchargedtl.CreatedBy = SecurityHelper.CurrentPrincipal.EmpId;
                                dc_serviceorderchargedtl.CreatedTime = dtnow;
                                unitOfWork.GetRepository<DC_ServiceOrderChargeDtl>().Insert(dc_serviceorderchargedtl);
                            }
                        }
                    }

                    var org_org = unitOfWork.GetRepository<ORG_Organization>().dbSet.Where(m => m.OrganizationID == SecurityHelper.CurrentPrincipal.OrgId).ToList();
                    if (org_org != null)
                    {
                        if (org_org.Count > 0)
                        {
                             //先付费，需要生成排号记录和实时排号数据
                            if (org_org[0].IsPayFirstFlag == true)
                            {
                                var serviceordersiid_list = new List<int>();
                                foreach (var sosimls in baseRequest.SerOrdSerItModelLists)
                                {
                                    serviceordersiid_list.Add(sosimls.ServiceOrderSIID);
                                }

                                if (serviceordersiid_list.Count > 0)
                                {
                                    var queueresponse = new BaseResponse();
                                    //to-do Queue Api -- wait for zhangyoujun
                                    queueresponse = service.SyncToCheckQueue(serviceordersiid_list, SecurityHelper.CurrentPrincipal.EmpId);
                                    if(queueresponse.IsSuccess == false){
                                        response.ResultCode = -1;
                                        response.ResultMessage = queueresponse.ResultMessage;
                                        return response;
                                    }
                                }
                            }
                        }
                    }

                    unitOfWork.Save();
                    unitOfWork.Commit();
                    response.ResultCode = 1001;
                    #endregion
                }
                else
                {
                    response.ResultCode = -1;
                    response.ResultMessage = "未查询到有效订单服务项目数据！";
                }
            }
            catch (Exception ex)
            {
                response.ResultCode = -1;
                response.ResultMessage = "保存异常，请联系管理员！";
            }

            return response;
        }


        public BaseResponse<IList<ServiceOrderChargeDtlModel>> GetServiceOrderRecByRsID(BaseRequest<PaymentsFilter> request)
        {
            BaseResponse<IList<ServiceOrderChargeDtlModel>> response = new BaseResponse<IList<ServiceOrderChargeDtlModel>>();
            var orderdata = (from a in unitOfWork.GetRepository<DC_ServiceOrderChargeDtl>().dbSet
                             join si in unitOfWork.GetRepository<DC_ServiceItem>().dbSet on a.ServiceItemID equals si.ServiceItemID
                             join b in unitOfWork.GetRepository<DC_ServiceOrderCharge>().dbSet on a.ServiceOrderChargeRecId equals b.ServiceOrderChargeRecId
                             join c in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet on a.ServiceOrderID equals c.ServiceOrderID
                             join d in unitOfWork.GetRepository<ORG_Employee>().dbSet on b.Operator equals d.EmployeeID
                             join e in unitOfWork.GetRepository<DC_PNC>().dbSet on c.PNCID equals e.PNCID
                             where c.IsDeleted == false && c.IsCancelFlag == false
                             && c.ResidentID == request.Data.ResidentID && c.ServiceType == 2 && b.ChargeStatus==1
                             orderby b.PayTime descending, c.CreatedTime descending
                             select new ServiceOrderChargeDtlModel()
                             {
                                 ServiceOrderChergeDtlD = a.ServiceOrderID,
                                 ServiceOrderChargeRecId = a.ServiceOrderChargeRecId,
                                 ServiceOrderID = a.ServiceOrderID,
                                 ResidentServicePlanItemID = a.ResidentServicePlanItemID,
                                 SONo=c.SONo,
                                 PNCID = e.PNCID,
                                 PNCName = e.PNCName,
                                 ServiceItemID = a.ServiceItemID,
                                 SINo=si.SINo,
                                 SIName=si.SIName,
                                 UnitsName=si.UnitName,
                                 UnitPrice = a.UnitPrice,
                                 Qty = a.Qty,
                                 DiscountPrice = a.DiscountPrice,
                                 SumPrice = a.SumPrice,
                                 Operator = b.Operator,
                                 OperatorName = d.EmpName,
                                 Payer = b.Payer,
                                 PaymentType = b.PaymentType,
                                 PayTime=b.PayTime,
                                 InvoiceNo=b.InvoiceNo
                             }).ToList();

            response.RecordsCount = orderdata.Count;
            List<ServiceOrderChargeDtlModel> list = null;
            if (request != null && request.PageSize > 0)
            {
                list = orderdata.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            }
            else
            {
                list = orderdata.ToList();
            }

            response.Data = list;
            return response;
        }
    }
}
