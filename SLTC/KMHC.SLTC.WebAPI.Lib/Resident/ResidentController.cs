using KMHC.Infrastructure;

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

    [RoutePrefix("api/Resident"), RoleBaseAuthorize]
    public class ResidentController : BaseApiController
    {
        IResidentService service = IOCContainer.Instance.Resolve<IResidentService>();
        IResidentServicePlanService servicePlanService = IOCContainer.Instance.Resolve<IResidentServicePlanService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<ResidentFilter> request)
        {
            if(request==null)
            {
                request = new BaseRequest<ResidentFilter>();
                request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            }
            var response = service.QueryResident(request);
            return Ok(response);
        }
        [Route(""), HttpGet]
        public IHttpActionResult Get(int CurrentPage, int PageSize, int PersonId)
        {
            BaseRequest<ResidentFilter> request = new BaseRequest<ResidentFilter>();
            request.Data.PersonId = PersonId;
            var response = service.QueryResident(request);
            return Ok(response);
        }

        [Route("{residentID}")]
        public IHttpActionResult Get( int residentID)
        {
            var response = service.GetResident(residentID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(ResidentModel baseRequest)
        {
            var user = SecurityHelper.CurrentPrincipal;
            if (user != null && user.OrgId != null)
            {
                baseRequest.OrganizationID = user.OrgId;
            }
            else
            {
                return Ok(new BaseResponse<ResidentModel>()
                {
                    IsSuccess = false,
                    ResultMessage = "无法获取当前机构,请使用机构管理员登录."
                });
            }
            var response = service.SaveResident(baseRequest);
            return Ok(response);
        }

        [Route("{residentID}")]
        public IHttpActionResult Delete(int residentID)
        {
            var response = service.DeleteResident(residentID);
            return Ok(response);
        }

        /// <summary>
        /// 获取会员服务套餐
        /// </summary>
        /// <param name="residentID"></param>
        /// <returns></returns>
        [Route("GetServicePlan"), HttpGet]
        public IHttpActionResult GetServicePlan(int residentID)
        {
            var response = servicePlanService.QueryResidentServicePlan(new BaseRequest<ResidentServicePlanFilter>() { Data = new ResidentServicePlanFilter() { ResidentId = residentID } });
            return Ok(response);
        }

        [Route("SetServicePlan")]
        public IHttpActionResult SetServicePlan(ServiceGroupOrderModel baseRequest)
        {
            var response = servicePlanService.SaveResidentServicePlan(baseRequest);
            return Ok(response);
        }

        [Route("GenAllQrCode"), HttpGet,AllowAnonymous]
        public IHttpActionResult GenAllQrCode()
        {
            var response = service.GenAllQrCode();
            return Ok(response);
        }

        /// <summary>
        /// 接收会员求救信息数据
        /// </summary>
        /// <param name="idno"></param>
        /// <returns></returns>
        [Route("SOSData"), HttpPost, AllowAnonymous]
        public IHttpActionResult SaveSOSData([FromBody]SOSFileter data)
        {
            
            var response = service.SaveSOSData(data);
            return Ok(response);
        }

        /// <summary>
        /// 获取当前日期内的求救信息,根据name过滤。
        /// </summary>
        /// <param name="idno"></param>
        /// <returns></returns>
        [Route("GetSosData"), HttpGet]
        public IHttpActionResult GetSosData([FromUri] string name)
        {
            var response = service.GetSOSData(SecurityHelper.CurrentPrincipal.OrgId, name);
            return Ok(response);
        }

        [Route("GetResidentInfo")]
        public IHttpActionResult GetResidentInfo(int residentID, int personID)
        {
            var response = service.GetResidentInfo(residentID, personID);
            return Ok(response);
        }
    }
}
