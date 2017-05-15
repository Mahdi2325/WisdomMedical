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
    [RoutePrefix("api/FeeDetail"), RoleBaseAuthorize]
    public class FeeDetailController : BaseApiController
    {
        IFeeDetailService service = IOCContainer.Instance.Resolve<IFeeDetailService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri] BaseRequest<FeeDetailFilter> request)
        {
            var response = service.QueryFeeDetail(request);
            return Ok(response);
        }

        [Route("{feeDetailID}")]
        public IHttpActionResult Get(int feeDetailID)
        {
            var response = service.GetFeeDetail(feeDetailID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(FeeDetailModel baseRequest)
        {
            var response = service.SaveFeeDetail(baseRequest);
            return Ok(response);
        }

        [Route("{feeDetailID}")]
        public IHttpActionResult Delete(int feeDetail)
        {
            var response = service.DeleteFeeDetail(feeDetail);
            return Ok(response);
        }
    }
}
