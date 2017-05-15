using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Implement
{
    public class ResidentCareService : BaseService, IResidentCareService
    {
        /// <summary>
        /// 手表服务接口地址
        /// </summary>
        private static string serviceAddress;
        private static string url;
        private static string appid;
        private static string healthRecordSecretKey;

        public string ServiceAddress
        {
            get
            {
                if (string.IsNullOrEmpty(serviceAddress))
                {
                    serviceAddress = ConfigurationManager.AppSettings["WatchServiceAddress"];
                }
                return serviceAddress;
            }
        }

        public string Url
        {
            get
            {
                if (string.IsNullOrEmpty(url))
                {
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

        /// <summary>
        /// 获取数据数量
        /// </summary>
        private static int PageSize = 20;
        /// <summary>
        /// 获取血压数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<Pressure>> GetPressureInfo(string IMEI)
        {
            BaseResponse<List<Pressure>> response = new BaseResponse<List<Pressure>>();

            string Address = string.Format("{0}/{1}/count/{2}/{3}/{4}", ServiceAddress, "bp", IMEI, 0, PageSize);
            string Json = CallService(Address);
            WebResponse<PressureContent> JsonData = (WebResponse<PressureContent>)JsonConvert.DeserializeObject(Json, typeof(WebResponse<PressureContent>));
            List<Pressure> pressure = JsonData.content.list;
            if (pressure!=null)
            {
                pressure = pressure.OrderBy(x => x.BPTime).ToList();
                pressure.ForEach(x => x.MeasureTime = StampToDateTime(x.BPTime).ToString("MM-dd"));
            }
            else
            {
                pressure = new List<Pressure>();
            }
            response.Data = pressure;
            return response;
        }
        /// <summary>
        /// 获取血糖数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<BloodSugar>> GetBloodSugarInfo(string IMEI)
        {
            BaseResponse<List<BloodSugar>> response = new BaseResponse<List<BloodSugar>>();
            string Address = string.Format("{0}/{1}/count/{2}/{3}/{4}", ServiceAddress, "bs", IMEI, 0, PageSize);
            string Json = CallService(Address);
            WebResponse<BloodSugarContent> JsonData = (WebResponse<BloodSugarContent>)JsonConvert.DeserializeObject(Json, typeof(WebResponse<BloodSugarContent>));
            List<BloodSugar> bloodSugar = JsonData.content.list;
            if (bloodSugar != null)
            {
                bloodSugar = bloodSugar.OrderBy(x => x.BSTime).ToList();
                bloodSugar.ForEach(x => x.MeasureTime = StampToDateTime(x.BSTime).ToString("MM-dd"));
            }
            else
            {
                bloodSugar = new List<BloodSugar>();
            }
            response.Data = bloodSugar;
            return response;
        }

        /// <summary>
        /// 获取心率数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<HeartRate>> GetHeartRateInfo(string IMEI)
        {
            BaseResponse<List<HeartRate>> response = new BaseResponse<List<HeartRate>>();
            string Address = string.Format("{0}/{1}/count/{2}/{3}/{4}", ServiceAddress, "hr", IMEI, 0, PageSize);
            string Json = CallService(Address);
            WebResponse<BloodOxygenContent> JsonData = (WebResponse<BloodOxygenContent>)JsonConvert.DeserializeObject(Json, typeof(WebResponse<BloodOxygenContent>));
            List<HeartRate> bloodOxygen = JsonData.content.list;
            if (bloodOxygen != null)
            {
                bloodOxygen = bloodOxygen.OrderBy(x => x.BSTime).ToList();
                bloodOxygen.ForEach(x => x.MeasureTime = StampToDateTime(x.BSTime).ToString("MM-dd"));
            }
            else
            {
                bloodOxygen = new List<HeartRate>();
            }
            response.Data = bloodOxygen;
            return response;
        }
        /// <summary>
        /// 获取手表数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<Watch>> GetWatchInfo(string phone)
        {
            BaseResponse<List<Watch>> response = new BaseResponse<List<Watch>>();
            string Address = string.Format("{0}/getbindDeviceWithWearersInfo/{1}?_type=json",ServiceAddress, phone);
            string Json = CallService(Address);
            WebResponse<WatchContent> JsonData = (WebResponse<WatchContent>)JsonConvert.DeserializeObject(Json, typeof(WebResponse<WatchContent>));
            List<Watch> Watch = JsonData.content.list;
            if (Watch==null)
            {
                Watch = new List<Watch>();
            }
            response.Data = Watch;
            return response;
        }
        /// <summary>
        /// 获取体检记录数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<ExamRecord>> GetExamrecordInfo(int currentPage, int pageSize, string idno)
        {
            Random rd = new Random();
            var once = rd.Next().ToString();
            var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
            var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

            BaseResponse<List<ExamRecord>> response = new BaseResponse<List<ExamRecord>>();
            string Address = string.Format("{0}/api/hlthrecord/examrecord?currentPage={1}&pageSize={2}&idno={3}&appid={4}&timeStamp={5}&once={6}&token={7}",Url, currentPage, pageSize, idno, AppID, timeStamp, once, token);
            string Json = CallService(Address);
            WebExamRecordResponse JsonData = (WebExamRecordResponse)JsonConvert.DeserializeObject(Json, typeof(WebExamRecordResponse));
            List<ExamRecord> ExamRecord = JsonData.Data;
            if (ExamRecord!=null)
            {
                ExamRecord = ExamRecord.OrderBy(x => x.ExamDate).ToList();
            }
            else
            {
                ExamRecord = new List<ExamRecord>();
            }
            response.Data = ExamRecord;
            return response;
        }
        /// <summary>
        /// 获取体检记录详细数据
        /// </summary>
        /// <returns></returns>
        public BaseResponse<List<Examresult>> GetExamResultInfo(int examId)
        {
            Random rd = new Random();
            var once = rd.Next().ToString();
            var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
            var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

            BaseResponse<List<Examresult>> response = new BaseResponse<List<Examresult>>();
            string Address = string.Format("{0}/api/hlthrecord/examresult?examId={1}&appid={2}&timeStamp={3}&once={4}&token={5}",Url, examId, AppID, timeStamp, once, token);
            string Json = CallService(Address);
            WebExamResultResponse JsonData = (WebExamResultResponse)JsonConvert.DeserializeObject(Json, typeof(WebExamResultResponse));
            List<Examresult> ExamRecord = JsonData.Data;
            if (ExamRecord==null)
            {
                ExamRecord = new List<Examresult>();
            }
            response.Data = ExamRecord;
            return response;
        }
        /// <summary>
        /// 获取会员档案
        /// </summary>
        /// <returns></returns>
        public BaseResponse<PersonFile> GetFileInfo(string idno)
        {
            Random rd = new Random();
            var once = rd.Next().ToString();
            var timeStamp = string.Format("{0:yyyyMMddHHmmss}", DateTime.Now);
            var token = Util.GetHealthToken(HealthRecordSecretKey, timeStamp, once);

            BaseResponse<PersonFile> response = new BaseResponse<PersonFile>();
            string Address = string.Format("{0}/api/hlthrecord/person?idno={1}&appid={2}&timeStamp={3}&once={4}&token={5}",Url, idno, AppID, timeStamp, once, token);
            string Json = CallService(Address);
            WebPersonFileResponse JsonData = (WebPersonFileResponse)JsonConvert.DeserializeObject(Json, typeof(WebPersonFileResponse));
            PersonFile PersonFile = JsonData.Data;
            if (PersonFile==null)
            {
                PersonFile = new PersonFile();
            }
            response.Data = PersonFile;
            return response;
        }
        private static string CallService(string address)
        {
            string timeStamp = DateTime.Now.ToString();
            var myReq = System.Net.WebRequest.Create(address) as System.Net.HttpWebRequest;
            myReq.Method = "GET";
            myReq.ContentType = "application/x-www-form-urlencoded";
            var myResponse = myReq.GetResponse() as System.Net.HttpWebResponse;

            var reader = new StreamReader(myResponse.GetResponseStream());
            return reader.ReadToEnd();
        }

        // 时间戳转为C#格式时间
        private DateTime StampToDateTime(string timeStamp)
        {
            DateTime dtStart = TimeZone.CurrentTimeZone.ToLocalTime(new DateTime(1970, 1, 1));
            long lTime = long.Parse(timeStamp + "0000");
            TimeSpan toNow = new TimeSpan(lTime);
            return dtStart.Add(toNow);
        }
    }
}
