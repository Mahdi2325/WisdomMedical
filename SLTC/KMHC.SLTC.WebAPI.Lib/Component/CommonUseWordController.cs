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

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/CommonUseWord"), RoleBaseAuthorize]
    public class CommonUseWordController : BaseApiController
    {
        //IDictManageService codeService = IOCContainer.Instance.Resolve<IDictManageService>();

        //[Route(""), HttpPost]
        //public IHttpActionResult Query(CommonUseWordFilter request)
        //{
        //    BaseResponse<Dictionary<string, List<CommonUseWord>>> response = new BaseResponse<Dictionary<string, List<CommonUseWord>>>();
        //    if (request != null)
        //    {
        //        if (request.TypeName != null)
        //        {
        //            var typeNames = request.TypeName.Split(',');
        //            if (typeNames.Length > 1)
        //            {
        //                request.TypeName = string.Empty;
        //                request.TypeNames = typeNames;
        //            }
        //        }
        //        var commonUseWordList = codeService.QueryCommonUseWord(request);
        //        response.Data = request.TypeNames.ToDictionary(typeName => typeName, no => commonUseWordList.Data.Where(o => o.TypeName == no).ToList());
        //    }
        //    else
        //    {
        //        response.Data = new Dictionary<string, List<CommonUseWord>>();
        //    }
        //    return Ok(response);
        //}
    }
}
