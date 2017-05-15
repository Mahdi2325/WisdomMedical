using KM.Common;
using KMHC.Infrastructure;
using KMHC.Infrastructure.Word;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebUI.Models;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Mvc;

namespace KMHC.SLTC.WebUI.Controllers
{
    public class ReportBaseController : Controller
    {
        public void GeneratePDF(string templateName, Action<WordDocument, ReportRequest> docOperation, ReportRequest request)
        {
            using (WordDocument doc = new WordDocument())
            {
                doc.Load(templateName);
                docOperation(doc, request);
                ViewBag.StartDocument = doc.SavePDF();
            }
        }
        /// <summary>
        /// 导出Word
        /// </summary>
        /// <param name="templateName"></param>
        /// <param name="docOperation"></param>
        /// <param name="request"></param>
        public void Download(string templateName, Action<WordDocument, ReportRequest> docOperation, ReportRequest request)
        {
            using (var doc = new WordDocument())
            {
                doc.Load(templateName);
                docOperation(doc, request);
                Util.DownloadFile(doc.SaveDoc());
            }
        }

        public void BindData(object obj, WordDocument doc)
        {
            var t = obj.GetType();
            foreach (var field in t.GetProperties())
            {
                if (field.PropertyType == typeof(DateTime?) || field.PropertyType == typeof(DateTime))
                {
                    doc.ReplaceText(field.Name, field.GetValue(obj) == null ? "" : ((DateTime)field.GetValue(obj)).ToString("yyyy-MM-dd"));
                }
                else
                {
                    doc.ReplaceText(field.Name, field.GetValue(obj) == null ? "" : field.GetValue(obj).ToString());
                }

            }
        }
        public void MultiBindData(object obj, WordDocument doc)
        {
            var t = obj.GetType();
            foreach (var field in t.GetProperties())
            {
                if (field.PropertyType == typeof(DateTime?) || field.PropertyType == typeof(DateTime))
                {
                    doc.ReplacePartText(field.Name, field.GetValue(obj) == null ? "" : ((DateTime)field.GetValue(obj)).ToString("yyyy-MM-dd"));
                }
                else
                {
                    doc.ReplacePartText(field.Name, field.GetValue(obj) == null ? "" : field.GetValue(obj).ToString());
                }

            }
        }
        public DataTable ToDataTable<T>(IEnumerable<T> collection)
        {
            var props = typeof(T).GetProperties();
            var dt = new DataTable();
            dt.Columns.AddRange(props.Select(p => new DataColumn(p.Name, p.PropertyType)).ToArray());
            if (collection.Count() > 0)
            {
                for (int i = 0; i < collection.Count(); i++)
                {
                    ArrayList tempList = new ArrayList();
                    foreach (PropertyInfo pi in props)
                    {
                        object obj = pi.GetValue(collection.ElementAt(i), null);
                        tempList.Add(obj);
                    }
                    object[] array = tempList.ToArray();
                    dt.LoadDataRow(array, true);
                }
            }
            return dt;
        }

        public void BindData(object obj, WordDocument doc, Dictionary<string, string> dict)
        {
            var t = obj.GetType();
            foreach (var field in t.GetProperties())
            {
                if (field.PropertyType == typeof(DateTime?) || field.PropertyType == typeof(DateTime))
                {
                    dict.Add(field.Name, field.GetValue(obj) == null ? "" : ((DateTime)field.GetValue(obj)).ToString("yyyy-MM-dd"));
                }
                else
                {
                    dict.Add(field.Name, field.GetValue(obj) == null ? "" : field.GetValue(obj).ToString());
                }
            }
        }


        protected void InitData(Type type, WordDocument doc)
        {
            foreach (var field in type.GetProperties())
            {
                doc.ReplaceText(field.Name, "");
            }
        }

        protected void InitValue(int start, int end, WordDocument doc)
        {
            for (var i = start; i <= end; i++)
            {
                doc.ReplaceText("Value" + i.ToString("00"), "");
            }
        }

        protected string GetOrgName(string orgId)
        {
            //IOrganizationManageService organizationManageService = IOCContainer.Instance.Resolve<IOrganizationManageService>();
            //var org = organizationManageService.GetOrg(orgId);
            //return org.Data == null ? "" : org.Data.OrgName;
            return "";
        }

    }
}
