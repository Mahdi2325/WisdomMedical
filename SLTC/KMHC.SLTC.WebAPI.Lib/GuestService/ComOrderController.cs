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

    [RoutePrefix("api/ComOrder"), RoleBaseAuthorize]
    public class ComOrderController : BaseApiController
    {
        IComOrderService service = IOCContainer.Instance.Resolve<IComOrderService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ServiceOrderFilter> request)
        {

            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryComOrder(request);
            return Ok(response);
        }

        [Route("{serviceOrderID}")]
        public IHttpActionResult Get(int serviceOrderID)
        {
            var response = service.GetComOrder(serviceOrderID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceOrderModel baseRequest)
        {
            baseRequest.OrderFrom = Enum.GetName(typeof(OrderFrom), OrderFrom.Web);
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveOrder(baseRequest);
            return Ok(response);
        }


        [Route("CancelOrder"), HttpGet]
        public IHttpActionResult CancelOrder(int serviceOrderID, int opreatorId)
        {
            var response = service.CancelOrder(serviceOrderID,opreatorId);
            return Ok(response);
        }

        [Route("SyncToCheckQueue"), HttpPost]
        public IHttpActionResult SyncToCheckQueue(SyncQueueModel baseRequest)
        {
            var response = service.SyncToCheckQueue(baseRequest.OrderSiIds, baseRequest.OperatorId);
            return Ok(response);
        }


        [Route("RemoveFromCheckQueue"), HttpPost]
        public IHttpActionResult RemoveFromCheckQueue(SyncQueueModel baseRequest)
        {
            var response = service.RemoveFromCheckQueue(baseRequest.OrderSiIds, baseRequest.OperatorId);
            return Ok(response);
        }

        [Route("GetOrderItems"), HttpGet]
        public IHttpActionResult GetOrderItems(int serviceOrderID)
        {
            var response = service.GetOrderItems(serviceOrderID);
            return Ok(response);
        }
    }
}
