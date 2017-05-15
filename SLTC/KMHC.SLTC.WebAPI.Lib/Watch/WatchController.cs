using KM.Common;
using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/Watch")]
    public class WatchController : BaseApiController
    {
        // GET api/<controller>
        public IEnumerable<string> Get()
        {
            //IReportManageService service = IOCContainer.Instance.Resolve<IReportManageService>();
            //var request = new BaseRequest<ReportFilter>();
            //var list = service.QueryReport(request);
            //return new string[] { "value1", "value2" };
            return new string[] { "value1", "value2" };
        }

        // GET api/<controller>/5
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<controller>
        public void Post([FromBody]string value)
        {
        }

        // PUT api/<controller>/5
        public void Put(int id, [FromBody]string value)
        {
        }

        // DELETE api/<controller>/5
        public void Delete(int id)
        {
        }

        [Route("{imei}")]
        public IHttpActionResult Get(string imei)
        {
            //string strProxyAdd = "", UserName = "", PassWord = "";
            //int port = 8880;


            HttpHelper http = new HttpHelper();
            //http.Proxy = new WebProxy();//设置代理
            //http.Proxy.Address = new Uri(string.Format("http://{0}:{1}", strProxyAdd, port));//设置代理服务器地址和端口
            //http.Proxy.Credentials = new NetworkCredential(UserName, PassWord);//设置代理用户名密码
            //http.Proxy = null;//清空代理
            //var strPHtml = http.PostPage("www.xxxx.com", "User=ABCD&Pwd=DEF");//向www.xxxx.com POST数据User=ABCD&Pwd=DEF
            var strHtml = http.GetHTML("http://watch.medquotient.com:8880/kmhc-modem-restful/services/member/getEmg/" + imei + "/0/10", "*/*", Encoding.UTF8, 20480);//从www.xxxx.com获取HTML数据，并用UTF8进行编码
            return Json(strHtml);
        }
    }
}