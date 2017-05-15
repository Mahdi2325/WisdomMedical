using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Interface.baiduTTS;

namespace KMHC.SLTC.WebAPI.Lib.Sequence
{
    //todo , RoleBaseAuthorize
    [RoutePrefix("api/ScreenDisplay")]
    public class ScreenDisplayController : BaseApiController
    {
        //
        IScreenSequenceService service = IOCContainer.Instance.Resolve<IScreenSequenceService>();
        IDeptService servicedept = IOCContainer.Instance.Resolve<IDeptService>();
        IBaiduTTSService servicebaidu = IOCContainer.Instance.Resolve<IBaiduTTSService>();
        [Route("GetScreenDisplay"), HttpGet]
        public IHttpActionResult GetScreenDisplay(int deptid = 0, int start = 0, int leng = -1)
        {
            BaseResponse<IList<ScreenDisplayModel>> response = new BaseResponse<IList<ScreenDisplayModel>>();
            response = service.QueryScreenList(deptid, start, leng);

            return Ok(response);
        }


        /// <summary>
        /// 根据orgId  查询所有科室信息
        /// </summary>
        /// <param name="orgId"></param>
        /// <returns></returns>
        [Route("QueryDept"), HttpGet]
        public IHttpActionResult QueryDept(int orgId)
        {
            var request = new BaseRequest<DeptFilter>();
            request.Data.OrganizationID = orgId;
            var response = servicedept.QueryDept(request);
            return Ok(response);
        }

        /// <summary>
        /// 查询所有Organization 
        /// </summary>
        /// <returns></returns>
        [Route("QueryOrg"), HttpGet]
        public IHttpActionResult QueryOrg()
        {
            BaseResponse<IList<OrganizationModel>> response = new BaseResponse<IList<OrganizationModel>>();
            response = service.QueryOrg();
            return Ok(response);
        }


        /// <summary>
        /// 百度TTS 获取播放URL
        /// </summary>
        /// <returns></returns>
        [Route("GetBaiduUri"), HttpGet]
        public string GetBaiduUri(string tex)
        {
            return servicebaidu.GetBaiduUri(tex);
        }

        /// <summary>
        /// 百度TTS 获取播放URL
        /// </summary>
        /// <returns></returns>
        [Route("GetBaiduToken"), HttpGet]
        public string GetBaiduToken()
        {
            return servicebaidu.GetBaiduToken();
        }

    }
}