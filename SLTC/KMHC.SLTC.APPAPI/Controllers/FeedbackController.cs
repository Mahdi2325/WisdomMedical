using KM.Common;
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
    public class FeedbackController : ApiController
    {
        IEmployeeService service = IOCContainer.Instance.Resolve<IEmployeeService>();
        /// <summary>
        /// 保存用户意见反馈信息
        /// </summary>
        /// <param name="baseRequest"></param>
        /// <returns></returns>
        public IHttpActionResult Post(FeedbackModel baseRequest)
        {
            var response = service.SaveFeedback(baseRequest);
            return Ok(response);
        }
    }
}
