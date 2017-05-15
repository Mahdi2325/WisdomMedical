using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
    [RoutePrefix("api/Evaluation")]
    public class EvaluationController : BaseApiController
    {
        IEvaluationService service = IOCContainer.Instance.Resolve<IEvaluationService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri] BaseRequest<EvaluationFilter> request)
        {
            var response = service.QueryEvaluation(request);
            return Ok(response);
        }

        [Route("QueryEmpWithEvluation"), HttpGet]
        public IHttpActionResult QueryEmpWithEvluation(int orgId,int CurrentPage=1,int PageSize=10)
        {
            var request = new BaseRequest<EmployeeFilter>();
            request.Data = new EmployeeFilter { JobTitle = new string[] { "6124" } };
            request.CurrentPage = CurrentPage;
            request.PageSize = PageSize;
            request.Data.OrganizationID = orgId;
            var response = service.QueryEmpWithEvluation(request);
            return Ok(response);
        }

        [Route("{evaluationID}")]
        public IHttpActionResult Get(int evaluationID)
        {
            var response = service.GetEvaluation(evaluationID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(EvaluationModel baseRequest)
        {
            var response = service.SaveEvaluation(baseRequest);
            return Ok(response);
        }

        [Route("{evaluationID}")]
        public IHttpActionResult Delete(int evaluationID)
        {
            var response = service.DeleteEvaluation(evaluationID);
            return Ok(response);
        }
    }
}
