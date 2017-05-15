using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.APPAPI.Filters;
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

namespace KMHC.SLTC.APPAPI.Controllers
{
    [RoutePrefix("api/FeeDetail")]
    public class FeeDetailController : ApiController
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
