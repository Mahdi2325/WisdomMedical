using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.Volunteer
{
    [RoutePrefix("api/Volunteer"), RoleBaseAuthorize]
    public class TimeStatisticsController : BaseApiController
    {
        IVolunteerService service = IOCContainer.Instance.Resolve<IVolunteerService>();
        [Route(""), HttpGet]
        public IHttpActionResult Query()
        {
            var request = new BaseRequest<GroupActivityCategoryFilter>() { };
            var response = service.QueryGroupActivity(request);
            return Ok(response);
        }
        [Route(""), HttpGet]
        public IHttpActionResult QueryPerson(string mark, string name = "")
        {
            if (mark == "volunteer")
            {
                var request = new BaseRequest<VolunteerFilter>();
                request.Data.Keywords = name;
                var response = service.QueryVolunteer(request);
                return Ok(response);
            }
            else if (mark == "task")
            {
                var request = new BaseRequest<GroupActivityTaskFilter>();
                request.Data.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
                var response = service.QueryGroupActivityTask(request);
                return Ok(response);
            }
            else
            {
                return Ok("");
            }
        }
        [Route(""), HttpGet]
        public IHttpActionResult Query(string mark, string startDate, string endDate)
        {
            if (mark == "task")
            {
                var request = new BaseRequest<GroupActivityTaskFilter>()
                {
                    Data = new GroupActivityTaskFilter
                    {
                        StartTime = startDate,
                        EndTime = endDate,
                    }
                };
                var response = service.QueryGroupActivityTask(request);
                return Ok(response);
            }
            else
            {
                return Ok("");
            }
        }
        [Route(""), HttpGet]
        public IHttpActionResult Query(string startDate, string endDate)
        {
            var request = new BaseRequest<GroupActivityRecordFilter>()
            {
                Data = new GroupActivityRecordFilter
                {
                    StartTime = Convert.ToDateTime(startDate),
                    EndTime = Convert.ToDateTime(endDate),
                    OrganizationID = SecurityHelper.CurrentPrincipal.OrgId
                }
            };
            var response = service.QueryGroupActivityRecord(request);
            return Ok(response);
        }
    }
}
