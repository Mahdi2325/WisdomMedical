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

namespace KMHC.SLTC.Business.Implement
{
    public class RefundService : BaseService, IRefundService
    {
        public BaseResponse<IList<SerOrdSerItModel>> GetServiceOrderByRsID(BaseRequest<PaymentsFilter> request)
        {
            BaseResponse<IList<SerOrdSerItModel>> response = new BaseResponse<IList<SerOrdSerItModel>>();
            var orderdata = (from a in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                             join b in unitOfWork.GetRepository<ORG_Employee>().dbSet on a.OrderCreator equals b.EmployeeID
                             join c in unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet on a.ServiceOrderID equals c.ServiceOrderID
                             join d in unitOfWork.GetRepository<DC_ServiceItem>().dbSet on c.ServiceItemID equals d.ServiceItemID
                             join e in unitOfWork.GetRepository<DC_PNC>().dbSet on a.PNCID equals e.PNCID
                             join f in unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet on c.ServiceOrderSIID equals f.ServiceOrderSIID
                             where a.IsDeleted == false && a.IsCancelFlag == false
                             && a.ResidentID == request.Data.ResidentID && a.ServiceType == 2 && c.ChargeStatus == 1
                             && f.CheckStatus != 3 && f.CheckStatus != 5 && f.OrganizationID == SecurityHelper.CurrentPrincipal.OrgId
                             orderby a.CreatedTime descending
                             select new SerOrdSerItModel()
                            {
                                ServiceOrderSIID = c.ServiceOrderSIID,
                                ServiceOrderID = c.ServiceOrderID,
                                ServiceItemID = c.ServiceItemID,
                                ResidentServicePlanItemID = c.ResidentServicePlanItemID,
                                CheckRoomQueueRecID = f.CheckRoomQueueRecID,
                                SONo = a.SONo,
                                PNCID = e.PNCID,
                                PNCName = e.PNCName,
                                CreatedTime = a.CreatedTime,
                                Otime = a.Otime,
                                EmpName = b.EmpName,
                                SINo = c.SINo,
                                SIName = c.SIName,
                                UnitName = d.UnitName,
                                UnitPrice = c.UnitPrice,
                                Qty = c.Qty,
                                DiscountPrice = c.DiscountPrice,
                                SumPrice = c.SumPrice
                            }).Distinct().ToList();
            response.Data = orderdata;
            return response;
        }

        public BaseResponse<IList<SerOrdSerItModel>> SaveRefundByRsId(SerOrdSerItModelList baseRequest)
        {
            BaseResponse<IList<SerOrdSerItModel>> response = new BaseResponse<IList<SerOrdSerItModel>>();
            SerOrdSerItModelList sosiml = new SerOrdSerItModelList();
            DateTime dtnow = DateTime.Now;
            var NoRefundCount = 0;
            var NoRefundMessage = "";
            try
            {
                unitOfWork.BeginTransaction();
                if (baseRequest.SerOrdSerItModelLists != null && baseRequest.RefundInfos != null)
                {
                    //--------------判断检查状态--------------
                    //3.就检中和5.完检不能取消退费
                    foreach (var soitem in baseRequest.SerOrdSerItModelLists)
                    {
                        var dc_crqr = unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet.Where(m => m.CheckRoomQueueRecID == soitem.CheckRoomQueueRecID
                            && m.OrganizationID == SecurityHelper.CurrentPrincipal.OrgId && (m.CheckStatus == 3 || m.CheckStatus == 5)).ToList();
                        if (dc_crqr != null)
                        {
                            if (dc_crqr.Count > 0)
                            {
                                NoRefundCount++;
                                NoRefundMessage = NoRefundMessage + "订单编号：" + soitem.SONo + " " + "服务名称：" + soitem.SIName + "，";
                            }
                        }
                    }
                    if (NoRefundCount > 0)
                    {
                        response.ResultCode = -1;
                        response.ResultMessage = NoRefundMessage + "，" + NoRefundCount + "个服务项目" + "就检中或已完检，无法退费！";
                        return response;
                    }
                    //-------------------------------------

                    #region 退费
                    foreach (var item in baseRequest.SerOrdSerItModelLists)
                    {
                        PaymentsServiceOrderModel psom = new PaymentsServiceOrderModel();
                        var serorderserit = unitOfWork.GetRepository<DC_SerOrdSerIt>().dbSet.Where(m => m.ServiceOrderSIID == item.ServiceOrderSIID).ToList();
                        if (serorderserit != null)
                        {
                            if (serorderserit.Count > 0)
                            {
                                //订单服务关联
                                serorderserit[0].ChargeStatus = 2;
                                serorderserit[0].ModifiedBy = SecurityHelper.CurrentPrincipal.EmpId;
                                serorderserit[0].ModifiedTime = dtnow;
                                unitOfWork.GetRepository<DC_SerOrdSerIt>().Update(serorderserit[0]);
                            }
                        }

                        var dc_crqr = unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet.Where(m => m.CheckRoomQueueRecID == item.CheckRoomQueueRecID).ToList();
                        if (dc_crqr != null)
                        {
                            if (dc_crqr.Count > 0)
                            {
                                if (dc_crqr[0].CheckStatus != 3 && dc_crqr[0].CheckStatus != 5)
                                {
                                    //排号记录
                                    dc_crqr[0].CheckStatus = 6;
                                    dc_crqr[0].ModifiedBy = SecurityHelper.CurrentPrincipal.EmpId;
                                    dc_crqr[0].ModifiedTime = dtnow;
                                    unitOfWork.GetRepository<DC_CheckRoomQueueRec>().Update(dc_crqr[0]);

                                    var dc_crq = unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet.Where(m => m.CheckRoomQueueRecID == item.CheckRoomQueueRecID).ToList();
                                    if (dc_crq != null)
                                    {
                                        if (dc_crq.Count > 0)
                                        {
                                            var queueid = dc_crq[0].QueueID;
                                            var dc_crqs = unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet.Where(m => m.QueueID == queueid).ToList();
                                            //实时排号
                                            if (dc_crqs != null)
                                            {
                                                if (dc_crqs.Count > 0)
                                                {
                                                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Delete(p => p.QueueID == queueid);
                                                }
                                            }
                                        }
                                    }

                                }
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
                                    dc_rspi[0].RestTimes = dc_rspi[0].RestTimes + (int)item.Qty;
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
                    var ls = sosiml.PaymentsServiceOrderModelLists.GroupBy(a => a.ServiceOrderID).Select(g => (new { ServiceOrderID = g.Key, SumPrice = g.Sum(item => item.SumPrice) })).ToList();

                    foreach (var psoml in ls)
                    {
                        var serviceorderchargerecid = String.Format("{0}{1}{2}", "R", SecurityHelper.CurrentPrincipal.OrgId, DateTime.Now.ToString("yyyyMMddHHmmss"));
                        //服务订单收费记录表
                        DC_ServiceOrderCharge serviceordercharge = new DC_ServiceOrderCharge();
                        serviceordercharge.ServiceOrderChargeRecId = serviceorderchargerecid;
                        serviceordercharge.ServiceOrderID = psoml.ServiceOrderID;
                        serviceordercharge.Price = psoml.SumPrice;
                        serviceordercharge.Payer = baseRequest.RefundInfos.Payer;
                        serviceordercharge.PaymentType = baseRequest.RefundInfos.PaymentType;
                        serviceordercharge.ReceiveAmount = baseRequest.RefundInfos.RefundAmt;
                        serviceordercharge.PayTime = dtnow;
                        serviceordercharge.RefundReason = baseRequest.RefundInfos.RefundReason;
                        serviceordercharge.ChargeStatus = 2;
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


        public BaseResponse<IList<ServiceOrderChargeDtlModel>> GetRefundServiceOrder(BaseRequest<PaymentsFilter> request)
        {
            BaseResponse<IList<ServiceOrderChargeDtlModel>> response = new BaseResponse<IList<ServiceOrderChargeDtlModel>>();
            var orderdata = (from a in unitOfWork.GetRepository<DC_ServiceOrderChargeDtl>().dbSet
                             join si in unitOfWork.GetRepository<DC_ServiceItem>().dbSet on a.ServiceItemID equals si.ServiceItemID
                             join b in unitOfWork.GetRepository<DC_ServiceOrderCharge>().dbSet on a.ServiceOrderChargeRecId equals b.ServiceOrderChargeRecId
                             join c in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet on a.ServiceOrderID equals c.ServiceOrderID
                             join d in unitOfWork.GetRepository<ORG_Employee>().dbSet on b.Operator equals d.EmployeeID
                             join e in unitOfWork.GetRepository<DC_PNC>().dbSet on c.PNCID equals e.PNCID
                             where c.IsDeleted == false && c.IsCancelFlag == false
                             && c.ResidentID == request.Data.ResidentID && c.ServiceType == 2 && b.ChargeStatus == 2
                             orderby b.PayTime descending, c.CreatedTime descending
                             select new ServiceOrderChargeDtlModel()
                             {
                                 ServiceOrderChergeDtlD = a.ServiceOrderID,
                                 ServiceOrderChargeRecId = a.ServiceOrderChargeRecId,
                                 ServiceOrderID = a.ServiceOrderID,
                                 ResidentServicePlanItemID = a.ResidentServicePlanItemID,
                                 SONo = c.SONo,
                                 PNCID = e.PNCID,
                                 PNCName = e.PNCName,
                                 ServiceItemID = a.ServiceItemID,
                                 SINo = si.SINo,
                                 SIName = si.SIName,
                                 UnitsName = si.UnitName,
                                 UnitPrice = a.UnitPrice,
                                 Qty = a.Qty,
                                 DiscountPrice = a.DiscountPrice,
                                 SumPrice = a.SumPrice,
                                 Operator = b.Operator,
                                 OperatorName = d.EmpName,
                                 Payer = b.Payer,
                                 PaymentType = b.PaymentType,
                                 PayTime = b.PayTime,
                                 InvoiceNo = b.InvoiceNo,
                                 RefundReason = b.RefundReason
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
