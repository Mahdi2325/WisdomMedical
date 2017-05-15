using KMHC.Infrastructure;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Web.Http;


namespace KMHC.SLTC.WebAPI.Lib.Report
{
    [RoutePrefix("api/PrintReport"), RoleBaseAuthorize]
    public class PrintReportController : BaseApiController
    {
        public IHttpActionResult View()
        {
            string dir = HttpContext.Current.Server.MapPath(VirtualPathUtility.GetDirectory("~"));
            FlexPaperConfig configManager = new FlexPaperConfig(dir);
            string doc = HttpContext.Current.Request["doc"];
            string page = HttpContext.Current.Request["page"];

            string swfFilePath = configManager.getConfig("path.swf") + doc + page + ".swf";
            string pdfFilePath = configManager.getConfig("path.pdf") + doc;
            if (!Util.validPdfParams(pdfFilePath, doc, page))
            {
                HttpContext.Current.Response.Write("[Incorrect file specified]");
            }
            else
            {
                String output = new pdf2swf(dir).convert(doc, page);
                if (output.Equals("[Converted]"))
                {
                    if (configManager.getConfig("allowcache") == "true")
                    {
                        Util.setCacheHeaders(HttpContext.Current);
                    }

                    HttpContext.Current.Response.AddHeader("Content-type", "application/x-shockwave-flash");
                    HttpContext.Current.Response.AddHeader("Accept-Ranges", "bytes");
                    HttpContext.Current.Response.AddHeader("Content-Length", new System.IO.FileInfo(swfFilePath).Length.ToString());

                    HttpContext.Current.Response.WriteFile(swfFilePath);
                }
                else
                {
                    HttpContext.Current.Response.Write(output);
                }
            }
            HttpContext.Current.Response.End();
            if (File.Exists(pdfFilePath))
            {
                File.Delete(pdfFilePath);
            }
            if (File.Exists(swfFilePath))
            {
                File.Delete(swfFilePath);
            }
            return Ok();
        }

        //TODO 预览PDF用的也是这个方法,非常不符合规范,需要重构!
        [HttpGet, Route("{code}")]
        public IHttpActionResult DownloadExcel(string code, long feeNo = 0, DateTime? startDate = null, DateTime? endDate = null)
        {
            string mapPath = HttpContext.Current.Server.MapPath(VirtualPathUtility.GetDirectory("~"));
           // IReportManageService reportManageService = IOCContainer.Instance.Resolve<IReportManageService>();
            string path = string.Empty;
            switch (code)
            {
                case "View":
                    this.View();
                    break;
            }
            return Ok();
        }
    }
}
