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
using System.Web;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/User")]
    public class UserController : ApiController
    {
        IUserService service = IOCContainer.Instance.Resolve<IUserService>();
        IResidentService residentService = IOCContainer.Instance.Resolve<IResidentService>();
        /// <summary>
        /// 修改密码，传入userId=7，报文体中数据格式{"newPassword":"111111","oldPassword":"111111"}
        /// </summary>
        /// <param name="userId"></param>
        /// <param name="pass"></param>
        /// <returns></returns>
        [Route("ChangePassword")]
        [HttpPut]
        public IHttpActionResult ChangePassword(string userId, [FromBody]dynamic pass)
        {
            var response = new BaseResponse<string>();
            var newPassword = pass.newPassword.Value;
            var oldPassword = pass.oldPassword.Value;

            if (!Regex.IsMatch(userId, @"^(^\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$", RegexOptions.IgnoreCase))
            {
                response = service.ChangePassword(userId, newPassword, oldPassword);
            }
            else
            {
                response = residentService.ChangePassword(userId, newPassword, oldPassword);
            }
            return Ok(response);
        }

    }
}
