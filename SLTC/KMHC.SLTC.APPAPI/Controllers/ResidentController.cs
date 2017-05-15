using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.APPAPI.Filters;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
     [RoutePrefix("api/Resident")]
     //[JWTAuthentication]
    public class ResidentController : ApiController
    {
        IResidentService service = IOCContainer.Instance.Resolve<IResidentService>();
        IResidentCareService residentCareService = IOCContainer.Instance.Resolve<IResidentCareService>();
         /// <summary>
        /// 获取会员列表，OrganizationID=1
         /// </summary>
         /// <param name="OrganizationID"></param>
         /// <returns></returns>
        [Route(""), HttpGet]
        public IHttpActionResult Query(int OrganizationID, string Keywords,int CurrentPage = 1, int PageSize = 10)
        {
            var request = new BaseRequest<ResidentFilter>()
            {
                PageSize = PageSize,
                CurrentPage = CurrentPage
            };
            request.Data.OrganizationID = OrganizationID;
            request.Data.Keywords = Keywords;
            var response = service.QueryResident(request);
            return Ok(response);
        }
        /// <summary>
        /// 获取会员详情，residentID=23有数据
        /// </summary>
        /// <param name="residentID"></param>
        /// <param name="OrganizationID"></param>
        /// <returns></returns>
        [Route("")]
        public IHttpActionResult Get(int residentID, int OrganizationID)
        {
            var response = service.GetResidentByResidentID(residentID,  OrganizationID);
            return Ok(response);
        }
         /// <summary>
        /// 获取血压，血糖，心率,IMEI=861232011120042有数据
         /// </summary>
         /// <param name="IMEI"></param>
        /// <param name="type">0 血压 1血糖 2心率</param>
         /// <returns></returns>
        [Route(""), HttpGet]
        public IHttpActionResult Query(string IMEI, int type)
        {
            if (type == 0)
            {
                var response = residentCareService.GetPressureInfo(IMEI);
                return Ok(response);
            }
            else if (type == 1)
            {
                var response = residentCareService.GetBloodSugarInfo(IMEI);
                return Ok(response);
            }
            else
            {
                var response = residentCareService.GetHeartRateInfo(IMEI);
                return Ok(response);
            }
        }
         /// <summary>
        /// 获取手表列表，手机号为13823641029有数据
         /// </summary>
         /// <param name="phone">手机号</param>
         /// <returns></returns>
        [Route("GetWatchInfo"), HttpGet]
        public IHttpActionResult GetWatchInfo(string phone)
        {
            var response = residentCareService.GetWatchInfo(phone);
            return Ok(response);
        }
         /// <summary>
        /// 获取体检记录信息，身份证号530322198410150736有数据
         /// </summary>
         /// <param name="currentPage"></param>
         /// <param name="pageSize"></param>
         /// <param name="idno">身份证号</param>
         /// <returns></returns>
        [Route("QueryExamrecord"), HttpGet]
        public IHttpActionResult QueryExamrecord(int currentPage, int pageSize, string idno)
        {
            var response = residentCareService.GetExamrecordInfo(currentPage, pageSize, idno);
            return Ok(response);
        }
         /// <summary>
        /// 获取体检记录详细信息，examId=81023
         /// </summary>
         /// <param name="examId"></param>
         /// <returns></returns>
        [Route("GetExamResultInfo"), HttpGet]
        public IHttpActionResult GetExamResultInfo(int examId)
        {
            var response = residentCareService.GetExamResultInfo(examId);
            return Ok(response);
        }
         /// <summary>
        /// 获取会员档案，idno=530322198410150736
         /// </summary>
         /// <param name="idno"></param>
         /// <returns></returns>
        [Route("GetFileInfo"), HttpGet]
        public IHttpActionResult GetFileInfo(string idno)
        {
            var response = residentCareService.GetFileInfo(idno);
            return Ok(response);
        }

    }
}
