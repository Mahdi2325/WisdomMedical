using KM.Common;
using KMHC.Infrastructure;
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

namespace KMHC.SLTC.WebAPI.Lib.ActivityManage
{
    [RoutePrefix("api/activity"), RoleBaseAuthorize]
    public class ActivityController : BaseApiController
    {
        IActivityService service = IOCContainer.Instance.Resolve<IActivityService>();
        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<GroupActivityRecordFilter> request)
        {
            var response = service.QueryActivity(request);
            return Ok(response);
        }

        [Route("{id}"), HttpGet]
        public IHttpActionResult Get(int id)
        {
            var response = service.GetActivity(id);
            return Ok(response);
        }

        /// <summary>
        /// 保存活动
        /// </summary>
        /// <param name="baseRequest"></param>
        /// <returns></returns>
        [Route("")]
        public IHttpActionResult Post(ActivityModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SaveActivity(baseRequest);
            return Ok(response);
        }

        /// <summary>
        /// 删除活动
        /// </summary>
        /// <param name="addressID"></param>
        /// <returns></returns>
        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteActivity(id);
            return Ok(response);
        }
    }
}
