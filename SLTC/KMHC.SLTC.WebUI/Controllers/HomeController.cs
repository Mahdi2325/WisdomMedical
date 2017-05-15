using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Mvc;
using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;
using KMHC.SLTC.Business.Interface;


namespace KMHC.SLTC.WebUI.Controllers
{
    public class HomeController : Controller
    {
        [AntiForgeryAuthorizationd]
        public ActionResult Index(string userId)
        {
            ViewBag.User = SecurityHelper.CurrentPrincipal;
            return View("MainForm");
        }

        [AntiForgeryAuthorizationd]
        public ActionResult CheckCard(string id,int? personId=null)
        {
            IPersonService service = IOCContainer.Instance.Resolve<IPersonService>();
            //service.IsExistCard(id, SecurityHelper.CurrentPrincipal.OrgId);
            return new ContentResult() { Content = service.IsExistCard(id, SecurityHelper.CurrentPrincipal.OrgId, personId).ToString().ToLower() };
        }

        [AntiForgeryAuthorizationd]
        public ActionResult ChangeOrg(int orgId)
        {
            SecurityHelper.CurrentPrincipal.OrgId = orgId;
            return new EmptyResult();
        }
        [AntiForgeryAuthorizationd]
        [HttpPost]
        public ActionResult CheckPwd(string name, string pwd)
        {
            ClientUserData user = null;
            var result = UserCheck(name, Util.Md5(pwd + name), ref user);
            return new JsonResult() { Data = new { Ok = result } };
        }

        public ActionResult Login()
        {
            return View();
        }


        [HttpPost]
        public ActionResult Login(string name, string pwd, string isRemember)
        {
            ViewBag.Msg = "";
            ClientUserData user = null;
            // 临时去掉验证码检验
            var code = "1234";
            Session["CheckCode"] = code.ToUpper();//Util.Md5(pwd+name)
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(pwd) && !string.IsNullOrEmpty(code) && UserCheck(name, Util.Md5(pwd + name), ref user)
                            && Session["CheckCode"] != null && code.ToUpper() == Session["CheckCode"].ToString().ToUpper())
            {
                IAuthenticationService authenticationService = IOCContainer.Instance.Resolve<IAuthenticationService>();
                authenticationService.SignIn(user, isRemember == "on");
                ViewBag.User = SecurityHelper.CurrentPrincipal;
                if (Request.UrlReferrer != null)
                {
                    var index = Request.UrlReferrer.PathAndQuery.IndexOf("ReturnUrl=");
                    if (index != -1)
                    {
                        var url = HttpUtility.UrlDecode(Request.UrlReferrer.PathAndQuery.Substring(index + 10), Encoding.UTF8);
                        return Redirect(HttpUtility.UrlDecode(url));
                    }
                }
                //if (!string.IsNullOrEmpty(Request.QueryString["ReturnUrl"]))
                //{
                //    return Redirect(HttpUtility.UrlDecode(Request.QueryString["ReturnUrl"]));
                //}
                return View("MainForm");
            }
            ViewBag.Msg = "请输入正确信息";
            return View();

        }


        public ActionResult Logout()
        {
            IAuthenticationService authenticationService = IOCContainer.Instance.Resolve<IAuthenticationService>();
            authenticationService.SignOut();
            return RedirectToAction("Login", "Home");
        }

        public ActionResult WapLogin(string name, string pwd)
        {
            if (!string.IsNullOrEmpty(name) && !string.IsNullOrEmpty(pwd))
            {
                return RedirectToAction("WapIndex");
            }
            return View();
        }
        public ActionResult WapIndex(string userId)
        {
            return View();
        }

        public ActionResult Report()
        {
            return View("ReportForm");
        }

        [HttpPost]
        public ActionResult GetWatchRecord(List<string> list)
        {
            if (list != null && list.Count > 0)
            {
                List<string> jlist = new List<string>();
                foreach (var item in list)
                {
                    HttpClient client = new HttpClient();
                    var r = client.GetAsync(item);
                    var responseJson = r.Result.Content.ReadAsStringAsync().Result;
                    jlist.Add(responseJson);
                }
                return Json(new { State = true, Json = jlist });
            }
            return Json(new { State = false });
        }

        private bool UserCheck(string name, string pwd, ref ClientUserData user)
        {
            var service = IOCContainer.Instance.Resolve<IUserService>();
            return service.Login(name, pwd, out user);
        }
    }
}