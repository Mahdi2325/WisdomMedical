using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.APPAPI.Filters;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/Activity")]
    //[JWTAuthentication]
    public class ActivityController : ApiController
    {
        IActivityService service = IOCContainer.Instance.Resolve<IActivityService>();
        /// <summary>
        /// 活动签到
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("SignActivity"),HttpPost]
        public IHttpActionResult SignActivity([FromBody]ActivitySignFileter request)
        {
            var response = service.SignActivity(request);
            return Ok(response);
        }

        /// <summary>
        /// 按照日期获取活动列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        [Route("GetActivitiesForMonth"), HttpGet]
        public IHttpActionResult GetActivitiesForDate(string date, int organizationID)
        {
            var response = service.GetActivitiesForDate(date, organizationID);
            return Ok(response);
        }

        /// <summary>
        /// 按照月份获取活动列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
         [Route("GetDatesForMonth"), HttpGet]
        public IHttpActionResult GetDatesForMonth(string date, int organizationID)
        {
            var response = service.GetDatesForMonth(date, organizationID);
            return Ok(response);
        }

         /// <summary>
         /// 获取活动内容详细
         /// </summary>
         /// <param name="request"></param>
         /// <returns></returns>
        [Route("GetDetailForActivitiyID"), HttpGet]
         public IHttpActionResult GetDetailForActivitiyID(int activitiyID)
        {
            var response = service.GetActivity(activitiyID);
            return Ok(response);
        } 
    }
}
