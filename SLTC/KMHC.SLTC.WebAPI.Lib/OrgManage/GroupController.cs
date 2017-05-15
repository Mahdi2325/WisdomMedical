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

namespace KMHC.SLTC.WebAPI.Lib.OrgManage
{

    [RoutePrefix("api/Group"), RoleBaseAuthorize]
    public class GroupController : BaseApiController
    {
        IGroupService service = IOCContainer.Instance.Resolve<IGroupService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<GroupFilter> request)
        {           
            var response = service.QueryGroup(request);
            return Ok(response);
        }

        [Route("{groupID}")]
        public IHttpActionResult Get(int groupID)
        {
            var response = service.GetGroup(groupID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(GroupModel baseRequest)
        {
            var response = service.SaveGroup(baseRequest);
            return Ok(response);
        }

        [Route("{groupID}")]
        public IHttpActionResult Delete(int groupID)
        {
            var response = service.DeleteGroup(groupID);
            return Ok(response);
        }
    }
}
