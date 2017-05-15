namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.Infrastructure;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.WebAPI.Lib.Attribute;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/ServiceOrder"), RoleBaseAuthorize]
    public class ServiceOrderController : BaseApiController
    {
        IServiceOrderService service = IOCContainer.Instance.Resolve<IServiceOrderService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceOrderFilter> request)
        {

            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryServiceOrder(request);
            return Ok(response);
        }

        [Route("{serviceOrderID}")]
        public IHttpActionResult Get(int serviceOrderID)
        {
            var response = service.GetServiceOrder(serviceOrderID);
            return Ok(response);
        }

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

        [Route("")]
        public IHttpActionResult Post(ServiceOrderModel baseRequest)
        {
            baseRequest.OrderFrom = Enum.GetName(typeof(OrderFrom), OrderFrom.Web);
            var response = service.SaveOrder(baseRequest);
            if (response.IsSuccess)
            {
                var orderPayRs = service.OrderSettlement(response.Data.ServiceOrderID, response.Data.Payment);
                response.IsSuccess = orderPayRs.IsSuccess;
                response.ResultMessage = orderPayRs.ResultMessage;
            }
            return Ok(response);
        }


        [Route("ConfirmOrder"), HttpGet]
        public IHttpActionResult ConfirmOrder(int serviceOrderID)
        {
            var response = service.ConfirmOrder(serviceOrderID);
            return Ok(response);
        }

        [Route("GetAuditRefund"), HttpGet]
        public IHttpActionResult GetAuditRefund(int serviceOrderID)
        {
            var response = service.GetAuditRefund(serviceOrderID);
            return Ok(response);
        }

        [Route("SaveAudit"), HttpPost]
        public IHttpActionResult SaveAudit(RefundRecordFilter filter)
        {
            var response = service.AuditRefund(filter);
            return Ok(response);
        }

        [Route("CancelOrder"), HttpGet]
        public IHttpActionResult CancelOrder(int serviceOrderID)
        {
            var response = service.AdminCancelOrder(serviceOrderID);
            return Ok(response);
        }
    }
}
