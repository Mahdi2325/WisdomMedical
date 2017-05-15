using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Model.FinancialManagement;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib
{
    [RoutePrefix("api/Payments"), RoleBaseAuthorize]
    public class PaymentsController : BaseApiController
    {
        IPaymentsService service = IOCContainer.Instance.Resolve<IPaymentsService>();
        [Route("GetServiceOrder/{residentID}/{serviceType}")]
        [HttpGet]
        public IHttpActionResult GetServiceOrder(int residentID,int serviceType)
        {
            BaseRequest<PaymentsFilter> request = new BaseRequest<PaymentsFilter>
            {
                Data = { ResidentID = residentID, ServiceType = serviceType }
            };
            var response = service.GetServiceOrderByRsID(request);
            return Ok(response);
        }

        [Route("GetPreHasAmount/{residentID}")]
        [HttpGet]
        public IHttpActionResult GetPreHasAmount(int residentID)
        {
            var response = service.GetPreHasAmountByRsID(residentID);
            return Ok(response);
        }

        [Route("SavePaymentByRsId"), HttpPost]
        public IHttpActionResult SavePaymentByRsId([FromBody] SerOrdSerItModelList baseRequest)
        {
            var response = service.SavePaymentByRsId(baseRequest);
            return Ok(response);
        }

        [Route("GetPayServiceOrder/{residentID}/{serviceType}")]
        [HttpGet]
        public IHttpActionResult GetPayServiceOrder(int residentID, int serviceType, int currentPage = 1, int pageSize = 10)
        {
            BaseRequest<PaymentsFilter> request = new BaseRequest<PaymentsFilter>
            {
                CurrentPage = currentPage,
                PageSize = pageSize,
                Data = { ResidentID = residentID, ServiceType = serviceType }
            };
            var response = service.GetServiceOrderRecByRsID(request);
            return Ok(response);
        }
    }
}
