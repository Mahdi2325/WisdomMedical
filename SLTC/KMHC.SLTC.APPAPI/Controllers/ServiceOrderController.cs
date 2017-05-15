namespace KMHC.SLTC.APPAPI.Controllers
{
    using KM.Common;
    using KMHC.Infrastructure;
    using KMHC.Infrastructure.Security;
    using KMHC.SLTC.APPAPI.Filters;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Net;
    using System.Net.Http;
    using System.Web.Http;

    [RoutePrefix("api/ServiceOrder")]
    //[JWTAuthentication]
    public class ServiceOrderController : ApiController
    {
        IServiceOrderService service = IOCContainer.Instance.Resolve<IServiceOrderService>();

        /// <summary>
        /// 获取订单列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route(""), HttpPost]
        public IHttpActionResult Query([FromBody]BaseRequest<ServiceOrderFilter> request)
        {
            var response = service.QueryServiceOrder(request);
            return Ok(response);
        }

        /// <summary>
        /// 获取单个订单
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        [Route("{serviceOrderID}")]
        public IHttpActionResult Get(int serviceOrderID)
        {
            var response = service.GetServiceOrder(serviceOrderID);
            return Ok(response);
        }

        /// <summary>
        /// 获取订单详情
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        [Route("Detail/{serviceOrderID}")]
        public IHttpActionResult GetOrderDetail(int serviceOrderID)
        {
            var response = new BaseResponse<object>();
            ITaskService taskService = IOCContainer.Instance.Resolve<ITaskService>();
            IResidentService residentService = IOCContainer.Instance.Resolve<IResidentService>();
            IEmployeeService employeeService = IOCContainer.Instance.Resolve<IEmployeeService>();
            var taskResponse = taskService.QueryTask(new BaseRequest<TaskFilter> { Data = { ServiceOrderID = serviceOrderID } });
            var orderResponse = service.GetServiceOrder(serviceOrderID);

            response.Data = new { Task = taskResponse.RecordsCount > 0 ? taskResponse.Data[0] : null, Order = orderResponse.Data };
            return Ok(response);
        }

        /// <summary>
        /// 批量下单
        /// </summary>
        /// <param name="baseRequest"></param>
        /// <returns></returns>
        [Route("SaveOrder"),HttpPost]
        public IHttpActionResult SaveOrder([FromBody]ServiceOrderModel baseRequest)
        {
            BaseResponse<ServiceOrderModel> response = new BaseResponse<ServiceOrderModel>();
            if (baseRequest != null)
            {
                baseRequest.OrderFrom = Enum.GetName(typeof(OrderFrom), OrderFrom.App);
                response = service.SaveOrder(baseRequest);
                if (response.IsSuccess && response.Data.OrderType==Enum.GetName(typeof(OrderType), OrderType.Group))
                {
                    var orderPayRs = service.OrderSettlement(response.Data.ServiceOrderID, response.Data.Payment);
                    response.IsSuccess = orderPayRs.IsSuccess;
                    response.ResultMessage = orderPayRs.ResultMessage;
                }
                return Ok(response);
            }
            else
            {
                response.ResultCode = 501;
                response.ResultMessage = "输入的参数不正确";
                response.IsSuccess = false;
                return Ok(response);
            }
        }

        /// <summary>
        /// 删除服务订单
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        [Route("{serviceOrderID}")]
        public IHttpActionResult Delete(int serviceOrderID)
        {
            var response = service.DeleteServiceOrder(serviceOrderID);
            return Ok(response);
        }

        /// <summary>
        /// 订单结算
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <param name="payment"></param>
        /// <returns></returns>
        [Route("OrderSettlement"),HttpGet]
        public IHttpActionResult OrderSettlement(int serviceOrderID,string payment)
        {
            var response = service.OrderSettlement(serviceOrderID, payment);
            return Ok(response);
        }

        /// <summary>
        /// 取消订单
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        [Route("CancelOrder"), HttpGet]
        public IHttpActionResult CancelOrder(int serviceOrderID)
        {
            var response = service.CancelOrder(serviceOrderID);
            return Ok(response);
        }

        /// <summary>
        /// 确认订单
        /// </summary>
        /// <param name="serviceOrderID"></param>
        /// <returns></returns>
        [Route("ConfirmOrder"), HttpGet]
        public IHttpActionResult ConfirmOrder(int serviceOrderID)
        {
            var response = service.ConfirmOrder(serviceOrderID);
            return Ok(response);
        }

        /// <summary>
        /// 获取时间段
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("GetEmpDatePlan"), HttpPost]
        public IHttpActionResult GetEmpDatePlan([FromBody]EmpPlanFilter request)
        {
            var response = service.GetDatePlan(request);
            return Ok(response);
        }


        /// <summary>
        /// 申请退款
        /// </summary>
        /// <param name="filter"></param>
        /// <returns></returns>
        [Route("RefundApply"), HttpPost]
        public IHttpActionResult RefundApply(RefundRecordFilter filter)
        {
            var response = service.RefundApply(filter);
            return Ok(response);
        }

        /// <summary>
        /// 获取退款列表
        /// </summary>
        /// <param name="ServiceOrderID"></param>
        /// <returns></returns>
        [Route("GetRefundList"), HttpGet]
        public IHttpActionResult GetRefundList(int ServiceOrderID)
        {
            var response = service.GetRefundList(ServiceOrderID);
            return Ok(response);
        }

        /// <summary>
        /// 获取退款信息
        /// </summary>
        /// <param name="ID"></param>
        /// <returns></returns>
        [Route("GetRefundInfo"), HttpGet]
        public IHttpActionResult GetRefundInfo(int ID)
        {
            var response = service.GetRefundInfo(ID);
            return Ok(response);
        }
    }
}
