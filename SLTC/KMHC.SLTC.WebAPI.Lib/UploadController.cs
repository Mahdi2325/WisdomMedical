using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;
using System.Web.Http.Results;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/Upload")]
    public class UploadController : BaseApiController
    {
        //[HttpPost, Route("{category}")]
        public async Task<IHttpActionResult> Post()
        {
            string category = HttpContext.Current.Request.Form["category"];
            return await this.Upload(category, "gif,jpg,jpeg,png,bmp,doc,docx");
        }

        private async Task<IHttpActionResult> Upload(string category, string fileTypes = null)
        {
            // 检查是否是 multipart/form-data 
            if (!Request.Content.IsMimeMultipartContent("form-data"))
                throw new HttpResponseException(HttpStatusCode.UnsupportedMediaType);

            var uploadPath = System.Configuration.ConfigurationSettings.AppSettings ["UploadPath"];

            //文件保存目录路径 
            string dirTempPath = uploadPath +"//"+ category;
            if (!Directory.Exists(dirTempPath))
            {
                Directory.CreateDirectory(dirTempPath);
            }
            // 设置上传目录 
            var provider = new MultipartFormDataStreamProvider(dirTempPath);
            List<UploadResponse> list = new List<UploadResponse>();
            try
            {
                await Request.Content.ReadAsMultipartAsync(provider)
                    .ContinueWith<HttpResponseMessage>(t =>
                {
                    if (t.IsFaulted || t.IsCanceled)
                    {
                        Request.CreateErrorResponse(HttpStatusCode.InternalServerError, t.Exception);
                    }

                    return Request.CreateResponse(HttpStatusCode.OK);
                });
                int i = 0;
                foreach (MultipartFileData file in provider.FileData)
                {
                    string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                    FileInfo fileinfo = new FileInfo(file.LocalFileName);
                    //最大文件大小 
                    long maxSize = 100 * 1024 * 1024; //100 M
                    if (fileinfo.Length <= 0)
                    {
                        list.Add(new UploadResponse { FileName = orfilename, Status = 0, Message = "请选择上传文件!" });
                    }
                    else if (fileinfo.Length > maxSize)
                    {
                        list.Add(new UploadResponse { FileName = orfilename, Status = 0, Message = "上传文件大小超过限制!" });
                    }
                    else
                    {
                        string fileExt = Path.GetExtension(orfilename);

                        if (!string.IsNullOrEmpty(fileTypes) && (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1))
                        {
                            list.Add(new UploadResponse { FileName = orfilename, Status = 0, Message = "上传文件扩展名是不允许的扩展名，有效的扩展名是：" + fileTypes });
                        }
                        else
                        {
                            String ymd = DateTime.Now.ToString("yyyyMM", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            String newFileName = DateTime.Now.ToString("ddHHmmssffff", System.Globalization.DateTimeFormatInfo.InvariantInfo);
                            newFileName = string.Format("{0}_{1}", newFileName, i);

                            string saveDir = Path.Combine(dirTempPath, ymd);
                            if (!Directory.Exists(saveDir))
                            {
                                Directory.CreateDirectory(saveDir);
                            }
                            string fileName = Path.Combine(saveDir, newFileName + fileExt);
                            fileinfo.CopyTo(fileName, true);
                            fileinfo.Delete();
                            list.Add(new UploadResponse { FileName = orfilename, Status = 1, SavedLocation = "/Uploads/" + category +"/"+ ymd + "/" + newFileName + fileExt });
                            i++;
                        }
                    }
                }
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
            return Ok(list);
        }
    }
    public class UploadResponse
    {
        public string FileName { get; set; }
        public int Status { get; set; }
        public string SavedLocation { get; set; }
        public string Message { get; set; }

    }
}
