using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.Charges
{
    [RoutePrefix("api/Payment"), RoleBaseAuthorize]
    public class PaymentController : BaseApiController
    {
        IPaymentService service = IOCContainer.Instance.Resolve<IPaymentService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<PaymentFilter> request)
        {
            var response = service.QueryPayment(request);
            return Ok(response);
        }

        [Route("{paymentID}")]
        public IHttpActionResult Get(int paymentID)
        {
            var response = service.GetPayment(paymentID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(PaymentModel baseRequest)
        {
            var response = service.SavePayment(baseRequest);
            return Ok(response);
        }

        [Route("{paymentID}")]
        public IHttpActionResult Delete(int paymentID)
        {
            var response = service.DeletePayment(paymentID);
            return Ok(response);
        }
    }
}
