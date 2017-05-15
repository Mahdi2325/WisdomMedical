using System;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using KMHC.SLTC.Business.Entity.Base;
using System.Linq;

namespace KMHC.SLTC.WebAPI.Lib.Sequence
{
    [RoutePrefix("api/appointList"), RoleBaseAuthorize]
    public class AppStatisticsController : BaseApiController 
    {
        IAppStatisticsService service = IOCContainer.Instance.Resolve<IAppStatisticsService>();

        [Route("GetappointStatistics/{dt}")]
        [HttpGet]
        public IHttpActionResult GetappointStatistics(DateTime dt)
        {
           string tmpdt=dt.ToShortDateString()+ " 12:00:00";
            DateTime cmpdt=DateTime.Parse(tmpdt);
            BaseResponse<object> response = new BaseResponse<object>();
            var res = service.GetAppPeopleByDateTime(dt);
            object obj = new
            {
                sevAppStatistics = res.Data.ServicePeople.GroupBy(
                x => new
                {
                    x.ServiceItemType
                })
                .Select(g => new
                {
                    ServiceItemType = g.Key.ServiceItemType,
                    MornCount = g.Count(a => a.AppTime <= cmpdt),
                    NoonCount = g.Count(a => a.AppTime > cmpdt)
                }).OrderByDescending(x => x.ServiceItemType)
                .ToList()
            };
            response.Data = obj;
            return Ok(response);
        }
    }
}
