using KMHC.Infrastructure;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface.baiduTTS;
using KMHC.SLTC.Persistence;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Implement.baiduTTS
{
    public class BaiduTTSService : BaseService,IBaiduTTSService
    {
        public string tok =string.Empty;
        private const string lan = "zh";//语言
        private const string per = "0";//发音人选择 0位女  1位男  默认 女0为女声，1为男声，3为情感合成-度逍遥，4为情感合成-度丫丫，默认为普通女声
        private const string ctp = "1";//客户端类型选择 web端为1  
        private const string spd = "3";//范围0~9  默认 5   语速
        private const string pit = "4";//范围0~9  默认 5   音调
        private const string vol = "5";//范围0~9  默认 5   音量
        private string cuid = Computer.GetMacAddress();//机器Mak地址
        private const string rest = "tex={0}&lan={1}&per={2}&ctp={3}&cuid={4}&tok={5}&spd={6}&pit={7}&vol={8}";

        /// <summary>
        /// tex 即：被转化的文本  可以是中英文结合体，如：hello 陈卧龙
        /// </summary>
        /// <param name="tex"></param>
        /// <returns></returns>
        public string GetBaiduUri(string tex)
        {
            tok = GetBaiduToken();
            string Uri = "http://tsn.baidu.com/text2audio?" + string.Format(rest, tex, lan, per, ctp, cuid, tok, spd, pit, vol);
            return Uri;
        }

        /// <summary>
        /// 获取百度Token  百度Token有效请为30天 
        /// </summary>
        /// <returns></returns>
        public string GetBaiduToken()
        {
            var baidu = base.unitOfWork.GetRepository<ORG_BaiDuAudioToken>().dbSet;
            var query = from CQ in baidu
                        orderby CQ.TokenID
                        select new BaiduToken { TokenID = CQ.TokenID, TokenValue = CQ.TokenValue, ExpiredTime = CQ.ExpiredTime, CreateTime = CQ.CreateTime };
            var data = query.ToList();

            if (data.Count() > 0)
            {
                DateTime ExpiredTime = Convert.ToDateTime(data[0].ExpiredTime);
                DateTime NowTime = DateTime.Now;
                if (NowTime > ExpiredTime)//过期了
                {
                    string NewToken = GetNewBaiduToken();
                    ORG_BaiDuAudioToken model = unitOfWork.GetRepository<ORG_BaiDuAudioToken>().dbSet.FirstOrDefault();
                    model.CreateTime = DateTime.Now;
                    model.ExpiredTime = DateTime.Now.AddDays(20);
                    model.TokenValue = NewToken;
                    unitOfWork.GetRepository<ORG_BaiDuAudioToken>().Update(model);
                    unitOfWork.Save();
                    return NewToken;
                }
                else
                {
                    return data[0].TokenValue;
                }
            }
            else//没有数据 则插入
            {
                string NewToken = GetNewBaiduToken();
                ORG_BaiDuAudioToken model = new ORG_BaiDuAudioToken();
                model.CreateTime = DateTime.Now;
                model.ExpiredTime = DateTime.Now.AddDays(20);
                model.TokenValue = NewToken;
                unitOfWork.GetRepository<ORG_BaiDuAudioToken>().Insert(model);
                unitOfWork.Save();
                return NewToken;
            }
        }

        public string GetNewBaiduToken()
        {
            ///百度文字转语音服务  对应百度账户：17706130901
            string Uri = "https://openapi.baidu.com/oauth/2.0/token?grant_type=client_credentials&client_id=N7ccPpFIlH8nsoGE86pMFq0w&client_secret=420d08fdf0c1be260a5470e61ad9071a";
            string page = GetPage(Uri, "");
            string Token = GetJsonValue(page, "access_token");
            return Token;
        }

        #region 获取网络资源
        /// <summary>
        /// 获取网络资源  
        /// </summary>
        /// <param name="posturl">请求的URL</param>
        /// <param name="postData">发送的数据</param>
        /// <returns>json格式的字符串</returns>
        public static string GetPage(string posturl, string postData)
        {
            //WX_SendNews news = new WX_SendNews(); 
            //posturl： news.Posturl;
            //postData：news.PostData;
            System.IO.Stream outstream = null;
            Stream instream = null;
            StreamReader sr = null;
            HttpWebResponse response = null;
            HttpWebRequest request = null;
            Encoding encoding = Encoding.UTF8;
            byte[] data = encoding.GetBytes(postData);
            // 准备请求...  
            try
            {
                // 设置参数  
                request = WebRequest.Create(posturl) as HttpWebRequest;
                CookieContainer cookieContainer = new CookieContainer();
                request.CookieContainer = cookieContainer;
                request.AllowAutoRedirect = true;
                request.Method = "POST";
                request.ContentType = "application/x-www-form-urlencoded";
                request.ContentLength = data.Length;
                outstream = request.GetRequestStream();
                outstream.Write(data, 0, data.Length);
                outstream.Close();
                //发送请求并获取相应回应数据  
                response = request.GetResponse() as HttpWebResponse;
                //直到request.GetResponse()程序才开始向目标网页发送Post请求  
                instream = response.GetResponseStream();
                sr = new StreamReader(instream, encoding);
                //返回结果网页（html）代码  
                string content = sr.ReadToEnd();
                string err = string.Empty;

                return content;
            }
            catch (Exception ex)
            {
                string err = ex.Message;
                return string.Empty;
            }
        }
        #endregion

        #region 获取Json字符串某节点的值
        /// <summary>
        /// 获取Json字符串某节点的值
        /// </summary>
        public static string GetJsonValue(string jsonStr, string key)
        {
            string result = string.Empty;
            if (!string.IsNullOrEmpty(jsonStr))
            {
                key = "\"" + key.Trim('"') + "\"";
                int index = jsonStr.IndexOf(key) + key.Length + 1;
                if (index > key.Length + 1)
                {
                    //先截逗号，若是最后一个，截“｝”号，取最小值
                    int end = jsonStr.IndexOf(',', index);
                    if (end == -1)
                    {
                        end = jsonStr.IndexOf('}', index);
                    }

                    result = jsonStr.Substring(index, end - index);
                    result = result.Trim(new char[] { '"', ' ', '\'' }); //过滤引号或空格
                }
            }
            return result;
        }
        #endregion

       
    }
}
