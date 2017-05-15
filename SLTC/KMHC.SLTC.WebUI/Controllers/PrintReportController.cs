using KMHC.Infrastructure.Word;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.WebUI.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace KMHC.SLTC.WebUI.Controllers
{
    public class PrintReportController : ReportBaseController
    {
        //
        // GET: /Report/
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Preview()
        {
            string templateName = Request["templateName"];
            string feeNo = Request["feeNo"];
            string feeName = Request["feeName"];
            string id = Request["id"];
            ReportRequest request = new ReportRequest();

            if (templateName != null)
            {
                switch (templateName)
                {
                    case "GuideLine":
                        if (!string.IsNullOrEmpty(id))
                        {
                            request.id = int.Parse(id);
                            request.feeName = feeName;
                           
                        }
                        this.GeneratePDF("GuideLine", this.GuideLineReport, request);
                        break;
                }
            }
            return View("Preview");
        }


        private void GuideLineReport(WordDocument doc, ReportRequest request)
        {

            var model = new DeptModel() { DeptName="演示"
            };



            BindData(model, doc);
        }
	}
}