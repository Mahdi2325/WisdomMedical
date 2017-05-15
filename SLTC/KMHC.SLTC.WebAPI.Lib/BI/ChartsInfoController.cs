using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.BI
{
    [RoutePrefix("api/Charts"), RoleBaseAuthorize]
    public class ChartsInfoController : BaseApiController
    {
        IChartService service = IOCContainer.Instance.Resolve<IChartService>();

        [Route("GetOrgDanAnList"), HttpGet]
        public IHttpActionResult GetOrgDanAnList(int GroupId)
        {
            var response = service.GetOrgDanAnList(GroupId);
            return Ok(response);
        }

        [Route("GetOrgHuiYuanList"), HttpGet]
        public IHttpActionResult GetOrgHuiYuanList(int GroupId)
        {
            var response = service.GetOrgHuiYuanList(GroupId);
            return Ok(response);
        }

        [Route("GetOrgOrderList"), HttpGet]
        public IHttpActionResult GetOrgOrderList(int GroupId)
        {
            var response = service.GetOrgOrderList(GroupId);
            return Ok(response);
        }

        [Route("GetOrgTaskList"), HttpGet]
        public IHttpActionResult GetOrgTaskList(int GroupId)
        {
            var response = service.GetOrgTaskList(GroupId);
            return Ok(response);
        }

        [Route("GetOrgSexList"), HttpGet]
        public IHttpActionResult GetOrgSexList(int GroupId)
        {
            var response = service.GetOrgSexList(GroupId);
            return Ok(response);
        }

        [Route("GetOrgAgeList"), HttpGet]
        public IHttpActionResult GetOrgAgeList(int GroupId)
        {
            var response = service.GetOrgAgeList(GroupId);
            return Ok(response);
        }       
    }
}
