using System;
using System.IO;
using System.Net;
using System.Text;

namespace KMHC.Infrastructure
{
    public class HttpHelper
    {
        #region 委托 事件
        public delegate void dgtProgValueChanged(long Value);
        /// <summary>
        /// 进度改变事件
        /// </summary>
        public event dgtProgValueChanged OnProgValueChanged;
        #endregion

        #region 属性
        /// <summary>
        /// 代理
        /// </summary>
        public WebProxy Proxy { get; set; }
        /// <summary>
        /// Cookie
        /// </summary>
        public CookieContainer UserCookie { get; set; }
        /// <summary>
        /// 重试次数
        /// </summary>
        public int IAfreshTime { get; set; }
        /// <summary>
        /// 错误次数
        /// </summary>
        public int IErrorTime { get; private set; }

        long m_ProgValue = 0;
        /// <summary>
        /// 当前读取字节
        /// </summary>
        public long ProgValue
        {
            get { return m_ProgValue; }
            private set
            {
                m_ProgValue = value;
                if (OnProgValueChanged != null)
                {
                    OnProgValueChanged(value);
                }
            }
        }
        /// <summary>
        /// 待读取最大字节
        /// </summary>
        public long ProgMaximum { get; private set; }

        #endregion

        #region 方法
        #region Get
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="URL">地址</param>
        /// <param name="Accept">Accept请求头</param>
        /// <returns>Html代码</returns>
        public string GetHTML(string URL, string Accept)
        {
            return GetHTML(URL, Accept, System.Text.Encoding.UTF8);
        }
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="URL">地址</param>
        /// <param name="Accept">Accept请求头</param>
        /// <param name="encoding">字符编码</param>
        /// <returns>Html代码</returns>
        public string GetHTML(string URL, string Accept, Encoding encoding)
        {
            return GetHTML(URL, Accept, encoding, 1024);
        }
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="URL">地址</param>
        /// <param name="Accept">Accept请求头</param>
        /// <param name="encoding">字符编码</param>
        /// <param name="bufflen">数据包大小</param>
        /// <returns>Html代码</returns>
        public string GetHTML(string URL, string Accept, Encoding encoding, int bufflen)
        {
            IErrorTime = 0;
            return _GetHTML(URL, Accept, encoding, bufflen);
        }
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="URL">地址</param>
        /// <param name="Accept">Accept请求头</param>
        /// <param name="encoding">字符编码</param>
        /// <param name="bufflen">数据包大小</param>
        /// <returns>Html代码</returns>
        private string _GetHTML(string URL, string Accept, Encoding encoding, int bufflen)
        {
            try
            {
                HttpWebRequest MyRequest = (HttpWebRequest)HttpWebRequest.Create(URL);
                MyRequest.Proxy = Proxy;
                MyRequest.Accept = Accept;
                if (UserCookie == null)
                {
                    UserCookie = new CookieContainer();
                }
                MyRequest.CookieContainer = UserCookie;
                HttpWebResponse MyResponse = (HttpWebResponse)MyRequest.GetResponse();
                return _GetHTML(MyResponse, encoding, bufflen);
            }
            catch (Exception erro)
            {
                if (erro.Message.Contains("连接") && IAfreshTime - IErrorTime > 0)
                {
                    IErrorTime++;
                    return _GetHTML(URL, Accept, encoding, bufflen);
                }
                throw;
            }
        }
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="MyResponse"></param>
        /// <param name="encoding">字符编码</param>
        /// <param name="bufflen">数据包大小</param>
        /// <returns></returns>
        private string _GetHTML(HttpWebResponse MyResponse, Encoding encoding, int bufflen)
        {
            using (Stream MyStream = MyResponse.GetResponseStream())
            {
                ProgMaximum = MyResponse.ContentLength;
                string result = null;
                long totalDownloadedByte = 0;
                byte[] by = new byte[bufflen];
                int osize = MyStream.Read(by, 0, by.Length);
                while (osize > 0)
                {
                    totalDownloadedByte = osize + totalDownloadedByte;
                    result += encoding.GetString(by, 0, osize);
                    ProgValue = totalDownloadedByte;
                    osize = MyStream.Read(by, 0, by.Length);
                }
                MyStream.Close();
                return result;
            }
        }
        #endregion


        #region GetImg
        /*
        public System.Drawing.Bitmap Getimg(string URL, string Accept)
        {
            return _GetBit(URL, Accept);
        }
        /// <summary>
        /// 获取HTML
        /// </summary>
        /// <param name="URL">地址</param>
        /// <param name="Accept">Accept请求头</param>
        /// <returns>Html代码</returns>
        private System.Drawing.Bitmap _GetBit(string URL, string Accept)
        {
            HttpWebRequest MyRequest = (HttpWebRequest)HttpWebRequest.Create(URL);
            MyRequest.Proxy = Proxy;
            MyRequest.Accept = Accept;
            if (UserCookie == null)
            {
                UserCookie = new CookieContainer();
            }
            MyRequest.CookieContainer = UserCookie;
            HttpWebResponse MyResponse = (HttpWebResponse)MyRequest.GetResponse();
            return _GetBit(MyResponse);
        }

        /// <summary>
        /// 获取图像
        /// </summary>
        /// <param name="MyResponse"></param>
        /// <returns></returns>
        private System.Drawing.Bitmap _GetBit(HttpWebResponse MyResponse)
        {
            using (Stream MyStream = MyResponse.GetResponseStream())
            {
                return new System.Drawing.Bitmap(MyStream);
            }
        }
        */
        #endregion

        #region Post
        /// <summary>
        /// 回发(字符编码默认UTF-8)
        /// </summary>
        /// <param name="URL">回发地址</param>
        /// <param name="PostData">参数</param>
        /// <returns>Html代码</returns>
        public string PostPage(string URL, string PostData)
        {
            return PostPage(URL, PostData, System.Text.Encoding.UTF8);
        }
        /// <summary>
        /// 回发
        /// </summary>
        /// <param name="URL">回发地址</param>
        /// <param name="PostData">参数</param>
        /// <param name="encoding">字符编码</param>
        /// <returns>Html代码</returns>
        public string PostPage(string URL, string PostData, Encoding encoding)
        {
            return PostPage(URL, PostData, encoding, null);
        }
        /// <summary>
        /// 回发
        /// </summary>
        /// <param name="URL">回发地址</param>
        /// <param name="PostData">参数</param>
        /// <param name="encoding">字符编码</param>
        /// <returns>Html代码</returns>
        public string PostPage(string URL, string PostData, Encoding encoding, string ContentType)
        {
            IErrorTime = 0;
            return _PostPage(URL, PostData, encoding, ContentType);
        }
        /// <summary>
        /// 回发
        /// </summary>
        /// <param name="URL">回发地址</param>
        /// <param name="PostData">参数</param>
        /// <param name="encoding">字符编码</param>
        /// <returns>Html代码</returns>
        private string _PostPage(string URL, string PostData, Encoding encoding, string ContentType)
        {
            try
            {
                if (ContentType == null)
                {
                    ContentType = "application/x-www-form-urlencoded";
                }
                HttpWebRequest MyRequest = (HttpWebRequest)HttpWebRequest.Create(URL);
                MyRequest.Proxy = Proxy;
                if (UserCookie == null)
                {
                    UserCookie = new CookieContainer();
                }
                MyRequest.CookieContainer = UserCookie;
                MyRequest.Method = "POST";
                MyRequest.ContentType = ContentType;
                byte[] b = encoding.GetBytes(PostData);
                MyRequest.ContentLength = b.Length;
                using (System.IO.Stream sw = MyRequest.GetRequestStream())
                {
                    try
                    {
                        sw.Write(b, 0, b.Length);
                    }
                    catch
                    {
                    }
                }
                HttpWebResponse MyResponse = (HttpWebResponse)MyRequest.GetResponse();
                return _GetHTML(MyResponse, encoding, 1024);
            }
            catch (Exception erro)
            {
                if (erro.Message.Contains("连接") && IAfreshTime - IErrorTime > 0)
                {
                    IErrorTime++;
                    return _PostPage(URL, PostData, encoding, ContentType);
                }
                throw;
            }
        }
        #endregion
        #endregion
    }
}