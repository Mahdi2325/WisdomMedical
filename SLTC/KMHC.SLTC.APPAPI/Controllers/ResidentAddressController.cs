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
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
     [RoutePrefix("api/Address")]
     //[JWTAuthentication]
    public class ResidentAddressController : ApiController
    {
         IResidentAddressService service = IOCContainer.Instance.Resolve<IResidentAddressService>();

         /// <summary>
         /// 根据会员ID获取会员的地址列表
         /// </summary>
         /// <param name="residentID"></param>
         /// <returns></returns>
         [Route(""), HttpGet]
         public IHttpActionResult Query(int residentID)
         {
             var response = service.QueryResidentAddress(residentID);
             return Ok(response);
         }

         /// <summary>
         /// 根据地址ID获取地址详情
         /// </summary>
         /// <param name="addressID"></param>
         /// <returns></returns>
         [Route(""), HttpGet]
         public IHttpActionResult Get(int addressID)
         {
             var response = service.GetResidentAddress(addressID);
             return Ok(response);
         }

         /// <summary>
         /// 保存地址
         /// </summary>
         /// <param name="baseRequest"></param>
         /// <returns></returns>
         [Route("")]
         public IHttpActionResult Post(ResidentAddressModel baseRequest)
         {
             var response = service.SaveResidentAddress(baseRequest);
             return Ok(response);
         }

         /// <summary>
         /// 删除地址
         /// </summary>
         /// <param name="addressID"></param>
         /// <returns></returns>
         [Route("{addressID}")]
         public IHttpActionResult Delete(int addressID)
         {
             var response = service.DeleteResidentAddress(addressID);
             return Ok(response);
         }         
    }
}
