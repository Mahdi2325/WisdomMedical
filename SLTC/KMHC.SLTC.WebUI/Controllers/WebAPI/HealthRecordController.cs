using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebUI.Controllers.WebAPI
{
    [RoutePrefix("api/hlthrecord")]
    public class HealthRecordController : BaseController
    {
        private static string url;
        private static string appid;
        private static string healthRecordSecretKey;
        public string Url { 
            get{
                if (string.IsNullOrEmpty(url)) {
                    url = ConfigurationManager.AppSettings["HealthRecordUrl"];
                }
                return url;
            } 
        }

        public string AppID
        {
            get
            {
                if (string.IsNullOrEmpty(appid))
                {
                    appid = ConfigurationManager.AppSettings["AppID"];
                }
                return appid;
            }
        }

        public string HealthRecordSecretKey
        {
            get
            {
                if (string.IsNullOrEmpty(healthRecordSecretKey))
                {
                    healthRecordSecretKey = ConfigurationManager.AppSettings["HealthRecordSecretKey"];
                }
                return healthRecordSecretKey;
            }
        }

        

        [HttpGet, Route("Person")]
        public async Task<HttpResponseMessage> PersonAsync(string BirthDate, string Gender, string IDNumber, string Name) 
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string json = await client.GetStringAsync(string.Format("api/hlthrecord/person?BirthDate={0}&Gender={1}&IDNumber={2}&Name={3}&appid={4}&timeStamp={5}&once={6}&token={7}", BirthDate, Gender, IDNumber, Name, AppID, timeStamp, once, token));
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }


        [HttpGet, Route("Person/{idno}")]
        public async Task<HttpResponseMessage> PersonAsync(string idno)
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);
                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string json = await client.GetStringAsync(string.Format("api/hlthrecord/person?idno={0}&appid={1}&timeStamp={2}&once={3}&token={4}", idno, AppID, timeStamp, once, token));
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }

        [HttpGet, Route("ExamResult")]
        public async Task<HttpResponseMessage> ExaminResult(int currentPage, int pageSize, string idnos, string items, string unit = "count")
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string json = await client.GetStringAsync(string.Format("api/hlthrecord/examresult?currentPage={0}&pageSize={1}&idnos={2}&items={3}&unit={4}&appid={5}&timeStamp={6}&once={7}&token={8}", currentPage, pageSize, idnos, items, unit, AppID, timeStamp, once, token));
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }


        [HttpGet, Route("ExamResult")]
        public async Task<HttpResponseMessage> ExaminResult(int examId)
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string json = await client.GetStringAsync(string.Format("api/hlthrecord/examresult?examid={0}&appid={1}&timeStamp={2}&once={3}&token={4}", examId, AppID, timeStamp, once, token));
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }


        [HttpGet, Route("ExamRecord")]
        public async Task<HttpResponseMessage> ExamRecord(int currentPage, int pageSize, string idno)
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                string json = await client.GetStringAsync(string.Format("api/hlthrecord/examrecord?currentPage={0}&pageSize={1}&idno={2}&appid={3}&timeStamp={4}&once={5}&token={6}", currentPage, pageSize, idno, AppID, timeStamp, once, token));
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }


        [HttpGet, Route("ExamRecord_Case")]
        public async Task<HttpResponseMessage> ExamRecord_Case([FromUri]BaseRequest<HealthFilter> request)
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var strQuery = string.Format("api/hlthrecord/examrecord?currentPage={0}&pageSize={1}&idno={2}&appid={3}&timeStamp={4}&once={5}&token={6}", request.CurrentPage, request.PageSize, request.Data.IdCard, AppID, timeStamp, once, token);
                if(request.Data.StartDate.HasValue){
                    strQuery += "&startDate=" + request.Data.StartDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                }
                if (request.Data.EndDate.HasValue)
                {
                    strQuery += "&endDate=" + request.Data.EndDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                }
                string json = await client.GetStringAsync(strQuery);
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }

        [HttpGet, Route("ExamResult_Case")]
        public async Task<HttpResponseMessage> ExamResult_Case([FromUri]BaseRequest<HealthFilter> request)
        {
            using (HttpClient client = new HttpClient())
            {
                Random rd = new Random();
                var once = rd.Next().ToString();
                var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
                var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

                client.BaseAddress = new Uri(Url);
                client.DefaultRequestHeaders.Accept.Clear();
                client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
                var strQuery = string.Format("api/hlthrecord/examresult?currentPage={0}&pageSize={1}&idnos={2}&items={3}&unit={4}&appid={5}&timeStamp={6}&once={7}&token={8}&orderBy=CreateDate desc", request.CurrentPage, request.PageSize, request.Data.IdCard, "554,556,776", "day", AppID, timeStamp, once, token);
                if (request.Data.StartDate.HasValue)
                {
                    strQuery += "&startDate=" + request.Data.StartDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                }
                if (request.Data.EndDate.HasValue)
                {
                    strQuery += "&endDate=" + request.Data.EndDate.Value.ToString("yyyy-MM-dd HH:mm:ss");
                }
                string json = await client.GetStringAsync(strQuery);
                return new HttpResponseMessage { Content = new StringContent(json, System.Text.Encoding.UTF8, "application/json") };
            }
        }
    }
}
