namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/ResidentServicePlan")]
    public class ResidentServicePlanController : ApiController
    {
        IResidentServicePlanService service = IOCContainer.Instance.Resolve<IResidentServicePlanService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int residentId,int currentPage=1, int pageSize=30)
        {
            BaseRequest<ResidentServicePlanFilter> request = new BaseRequest<ResidentServicePlanFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            request.Data.ResidentId = residentId;
            var response = service.QueryResidentServicePlan(request);
            return Ok(response);
        }

        [Route("{residentServicePlanID}")]
        public IHttpActionResult Get(int residentServicePlanID)
        {
            var response = service.GetResidentServicePlan(residentServicePlanID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ServiceGroupOrderModel baseRequest)
        {
            var response = service.SaveResidentServicePlan(baseRequest);
            return Ok(response);
        }

        [Route("{residentServicePlanID}")]
        public IHttpActionResult Delete(int residentServicePlanID)
        {
            var response = service.DeleteResidentServicePlan(residentServicePlanID);
            return Ok(response);
        }
    }
}
