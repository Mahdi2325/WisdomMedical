using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.APPAPI.Models;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text.RegularExpressions;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
    [RoutePrefix("api/Authentication")]
    public class AuthenticationController : ApiController
    {
        IUserService service = IOCContainer.Instance.Resolve<IUserService>();
        IResidentService residentService = IOCContainer.Instance.Resolve<IResidentService>();
        IOrganizationService orgService = IOCContainer.Instance.Resolve<IOrganizationService>();

        /// <summary>
        /// 登录接口
        /// </summary>
        /// <param name="auth">参数</param>
        public IHttpActionResult Post([FromBody] dynamic auth)
        {
            BaseResponse<IClientLoginUser> response = new BaseResponse<IClientLoginUser>();
            if (auth == null)
            {
                response.ResultCode = 501;
                response.ResultMessage = "输入的参数不正确";
                response.IsSuccess = false;
                return Ok(response);
            }
            var uid = auth.uid.Value;
            var pwd = auth.pwd.Value;
            IClientLoginUser rtUser = null;
            bool loginRs;
            if (!Regex.IsMatch(uid, @"^(^\d{15}$|^\d{18}$|^\d{17}(\d|X|x))$", RegexOptions.IgnoreCase))
            {
                ClientUserData user = null;
                loginRs = service.Login(uid, Util.Md5(pwd + uid), out user);
                if (user!=null)
                {
                    user.UserType = Enum.GetName(typeof(UserType), UserType.Employee);
                }
                rtUser = user;
            }
            else
            {
                ClientResidentData user = null;
                loginRs = residentService.Login(uid, Util.Md5(pwd + uid), out user);
                if (user != null)
                {
                    user.UserType = Enum.GetName(typeof(UserType), UserType.Resident);
                }
                rtUser = user;
            }

            if (rtUser == null || !loginRs)
            {
                response.ResultCode = 502;
                response.ResultMessage = "输入的用户名或密码不正确";
                response.IsSuccess = false;
                return Ok(response);
            }
            else
            {
                response.ResultCode = 200;
                response.ResultMessage = "登录成功";
                response.Data = rtUser;
                //生成Token
                var jwtcreated = Math.Round((DateTime.UtcNow - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalSeconds + 5);
                var payload = new Dictionary<string, dynamic>
                {
                    {"iss",uid},
                    {"iat",jwtcreated}
                };
                string token = JWT.JsonWebToken.Encode(payload, KMHC.SLTC.Business.Entity.Constants.SecretKey, JWT.JwtHashAlgorithm.HS256);
                response.Token = token;
                //KMHC.Infrastructure.Cached.LocalCachedProvider.Instance.Set(uid, 1);
                return Ok(response); 
            }
            
        }        
    }
}
