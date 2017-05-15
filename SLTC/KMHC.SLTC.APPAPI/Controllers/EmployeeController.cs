using KM.Common;
using KMHC.SLTC.APPAPI.Filters;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Configuration;
using System.Drawing;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;

namespace KMHC.SLTC.APPAPI.Controllers
{
    [RoutePrefix("api/Employee")]
    //[JWTAuthentication]
    public class EmployeeController : ApiController
    {
        IEmployeeService service = IOCContainer.Instance.Resolve<IEmployeeService>();
        ITaskService taskService = IOCContainer.Instance.Resolve<ITaskService>();
        /// <summary>
        /// 根据employeeID获取员工信息，传入employeeID=34有数据，employeeID就是登录信息中的工号EmpId
        /// </summary>
        /// <param name="employeeID"></param>
        /// <returns></returns>
        public IHttpActionResult Get(int employeeID)
        {
            var response = service.GetEmployee(employeeID);

            BaseRequest<TaskFilter> request = new BaseRequest<TaskFilter>()
            {
                CurrentPage = 1,
                PageSize = 30,
                Data = new TaskFilter()
                {
                    EmployeeId = employeeID,
                    type = 1,
                    Status = new string[]{"Finish"}
                }

            };
            var tskResponse = taskService.GetMyPerformance(request);
            response.Data.CompletedTaskNum = tskResponse.Data.completedTaskNum;
            response.Data.CompletedTaskAmount = tskResponse.Data.completedTaskAmount;
            return Ok(response);
        }
        /// <summary>
        /// 保存员工信息
        /// </summary>
        /// <param name="baseRequest"></param>
        /// <returns></returns>
        public IHttpActionResult Post(EmployeeModel baseRequest)
        {
            var response = service.SaveEmployee(baseRequest);
            return Ok(response);
        }
        
        /// <summary>
        /// 上传员工头像，传入jpg格式的二进制文件
        /// </summary>
        /// <param name="base64String"></param>
        /// <returns></returns>
        [Route("UploadAvatarStream"), HttpPost]
        public async Task<IHttpActionResult> UploadAvatarStream()
        {
            BaseResponse<List<FileUpModel>> response = new BaseResponse<List<FileUpModel>>();
            response.Data = new List<FileUpModel>();

            var uploadPath = ConfigurationManager.AppSettings["UploadPath"];
            string filePath = uploadPath+ "\\EmpployeeAvatar\\";
            if (Directory.Exists(filePath) == false)
            {
                Directory.CreateDirectory(filePath);
            }

            try
            {
                 List<FileUpModel> rt = new List<FileUpModel>();
                 var provider = new ReNameMultipartFormDataStreamProvider(filePath);

                 await Request.Content.ReadAsMultipartAsync(provider).ContinueWith(o =>
                 {

                     foreach (var file in provider.FileData)
                     {
                         var fileUpRs = new FileUpModel();
                         string orfilename = file.Headers.ContentDisposition.FileName.TrimStart('"').TrimEnd('"');
                         FileInfo fileinfo = new FileInfo(file.LocalFileName);
                         //最大文件大小 
                         int maxSize = 1000000;
                         fileUpRs.FileName = orfilename;
                         if (fileinfo.Length <= 0)
                         {
                             fileUpRs.UpResult = false;
                             fileUpRs.Reason = "请选择上传文件";
                         }
                         else if (fileinfo.Length > maxSize)
                         {
                             fileUpRs.UpResult = false;
                             fileUpRs.Reason = "上传文件大小超过限制";
                         }
                         else
                         {
                             string fileExt = orfilename.Substring(orfilename.LastIndexOf('.'));
                             //定义允许上传的文件扩展名 
                             String fileTypes = "gif,jpg,jpeg,png,bmp";
                             if (String.IsNullOrEmpty(fileExt) || Array.IndexOf(fileTypes.Split(','), fileExt.Substring(1).ToLower()) == -1)
                             {
                                 fileUpRs.UpResult = false;
                                 fileUpRs.Reason = "上传的文件格式不是图片";
                             }
                             else
                             {
                                 fileUpRs.UpResult = true;
                                 fileUpRs.FilePath = string.Format(@"/Uploads/EmpployeeAvatar/{0}", System.IO.Path.GetFileName(file.LocalFileName));
                                 fileUpRs.Reason = "上传成功";
                             }
                         }
                         rt.Add(fileUpRs);
                     }
                 });

                 response.Data = rt;
            }
            catch (Exception ex)
            {
                response.Data = null;
                response.ResultMessage = ex.Message;
                response.IsSuccess = false;
            }
            return Ok(response);
        }
    }

    

    /// <summary>
    /// 重命名上传的文件
    /// </summary>
    public class ReNameMultipartFormDataStreamProvider : MultipartFormDataStreamProvider
    {
        public ReNameMultipartFormDataStreamProvider(string root)
            : base(root)
        { }

        public override string GetLocalFileName(System.Net.Http.Headers.HttpContentHeaders headers)
        {
            string fileNamePrefix = DateTime.Now.ToString("yyyyMMddHHmmssffff");
            string fileName = string.Format(@"{0}.jpg", fileNamePrefix);
            return fileName;
        }

    }
}
