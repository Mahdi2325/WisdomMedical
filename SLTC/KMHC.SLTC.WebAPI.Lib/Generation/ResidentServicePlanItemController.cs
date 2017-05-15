namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
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

    [RoutePrefix("api/ResidentServicePlanItem"), RoleBaseAuthorize]
    public class ResidentServicePlanItemController : BaseApiController
    {
        IResidentServicePlanItemService service = IOCContainer.Instance.Resolve<IResidentServicePlanItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<ResidentServicePlanItemFilter> request = new BaseRequest<ResidentServicePlanItemFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryResidentServicePlanItem(request);
            return Ok(response);
        }

        [Route("{residentServicePlanItemID}")]
        public IHttpActionResult Get(int residentServicePlanItemID)
        {
            var response = service.GetResidentServicePlanItem(residentServicePlanItemID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ResidentServicePlanItemModel baseRequest)
        {
            var response = service.SaveResidentServicePlanItem(baseRequest);
            return Ok(response);
        }

        [Route("{residentServicePlanItemID}")]
        public IHttpActionResult Delete(int residentServicePlanItemID)
        {
            var response = service.DeleteResidentServicePlanItem(residentServicePlanItemID);
            return Ok(response);
        }
    }
}
