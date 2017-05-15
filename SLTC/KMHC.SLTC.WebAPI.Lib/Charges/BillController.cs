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
    [RoutePrefix("api/Bill"), RoleBaseAuthorize]
    public class BillController : BaseApiController
    {
        IBillService service = IOCContainer.Instance.Resolve<IBillService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<BillFilter> request)
        {
            var response = service.QueryBill(request);
            return Ok(response);
        }

        [Route("{billID}")]
        public IHttpActionResult Get(int billID)
        {
            var response = service.GetBill(billID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(BillModel baseRequest)
        {           
            var response = service.SaveBill(baseRequest);
            return Ok(response);
        }

        [Route("{billID}")]
        public IHttpActionResult Delete(int billID)
        {
            var response = service.DeleteBill(billID);
            return Ok(response);
        }
    }
}
