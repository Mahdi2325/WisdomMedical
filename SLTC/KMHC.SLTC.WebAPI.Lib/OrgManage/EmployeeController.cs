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

namespace KMHC.SLTC.WebAPI.Lib.OrgManage
{
    [RoutePrefix("api/Employee"), RoleBaseAuthorize]
    public class EmployeeController : BaseApiController
    {
        IEmployeeService service = IOCContainer.Instance.Resolve<IEmployeeService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<EmployeeFilter> request)
        {
            request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.QueryEmployee(request);
            return Ok(response);
        }

        [Route("{employeeID}")]
        public IHttpActionResult Get(int employeeID)
        {
            var response = service.GetEmployee(employeeID);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(EmployeeModel baseRequest)
        {
            var response = service.SaveEmployee(baseRequest);
            return Ok(response);
        }

        [Route("{employeeID}")]
        public IHttpActionResult Delete(int employeeID)
        {
            var response = service.DeleteEmployee(employeeID);
            return Ok(response);
        }

        [Route("GetUserByEmployeeID")]
        public IHttpActionResult GetUserByEmployeeID(int employeeID)
        {
            var response = service.GetUserByEmployeeID(employeeID);
            return Ok(response);
        }
    }
}
