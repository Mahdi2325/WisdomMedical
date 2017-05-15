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
    [RoutePrefix("api/Refund"), RoleBaseAuthorize]
    public class RefundController : BaseApiController
    {
        IRefundService service = IOCContainer.Instance.Resolve<IRefundService>();
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

        [Route("SaveRefundByRsId"), HttpPost]
        public IHttpActionResult SaveRefundByRsId([FromBody] SerOrdSerItModelList baseRequest)
        {
            var response = service.SaveRefundByRsId(baseRequest);
            return Ok(response);
        }

        [Route("GetRefundServiceOrder/{residentID}/{serviceType}")]
        [HttpGet]
        public IHttpActionResult GetRefundServiceOrder(int residentID, int serviceType, int currentPage = 1, int pageSize = 10)
        {
            BaseRequest<PaymentsFilter> request = new BaseRequest<PaymentsFilter>
            {
                CurrentPage = currentPage,
                PageSize = pageSize,
                Data = { ResidentID = residentID, ServiceType = serviceType }
            };
            var response = service.GetRefundServiceOrder(request);
            return Ok(response);
        }
    }
}
