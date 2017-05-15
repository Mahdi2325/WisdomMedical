using Aspose.Words;
using Aspose.Words.Drawing.Charts;
using Novacode;
using NPOI.SS.UserModel;
using NPOI.XSSF.UserModel;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace KMHC.Infrastructure.Word
{
    public class WordDocument : IDisposable
    {
        private DocX document;
        private DocX partDocument;
        private DocX partDocumentModel;
        private FlexPaperConfig configManager;
        private Novacode.Paragraph nextPageBreaker;

        public void Load(string templateName)
        {
            string mapPath = HttpContext.Current.Server.MapPath(VirtualPathUtility.GetDirectory("~"));
            string path = string.Format(@"{0}Templates\{1}.docx", mapPath, templateName);
            this.document = DocX.Load(path);
            this.configManager = new FlexPaperConfig(mapPath);
        }
        public void Dispose()
        {
            if (this.document != null)
            {
                this.document.Dispose();
            }
        }
        public void ReplaceText(string searchValue, string newValue)
        {
            this.document.ReplaceText(string.Format("{0}", searchValue), newValue);
        }

        public void FillTable(int tableIndex, DataTable dt, string end = "", string start = "", int startRow = 0)
        {
            var table = document.Tables[tableIndex];

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Row row;
                if (table.Rows.Count > i + startRow)
                {
                    row = table.Rows[i + startRow];
                }
                else
                {
                    row = table.InsertRow(table.Rows[startRow]);
                }
                for (int j = 0; j < dt.Columns.Count; j++)
                {

                    //table.Rows[0].MergeCells(0, 3);
                    var p = row.Cells[j].Paragraphs.First();
                    if (j == 0)
                    {
                        p.ReplaceText(p.Text, start + dr[j] + end);
                    }
                    else
                    {
                        p.ReplaceText(p.Text, dr[j].ToString());
                    }

                }
            }
        }
        public void MultiFillTable(int tableIndex, DataTable dt, string end = "", string start = "", int startRow = 0)
        {
            var table = partDocument.Tables[tableIndex];

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Row row;
                if (table.Rows.Count > i + startRow)
                {
                    row = table.Rows[i + startRow];
                }
                else
                {
                    row = table.InsertRow(table.Rows[startRow]);
                }
                for (int j = 0; j < dt.Columns.Count; j++)
                {

                    //table.Rows[0].MergeCells(0, 3);
                    var p = row.Cells[j].Paragraphs.First();
                    if (j == 0)
                    {
                        p.ReplaceText(p.Text, start + dr[j] + end);
                    }
                    else
                    {
                        p.ReplaceText(p.Text, dr[j].ToString());
                    }

                }
            }
        }
        //问题提示
        public void FillQuestion(int tableIndex, DataTable dt, int cellcount)
        {
            var table = document.Tables[tableIndex];
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                for (var k = 1; k <= dt.Columns.Count; k++)
                {
                    //一格的
                    if (j == 0)
                    {
                        if (k == 1)
                        {
                            if (cellcount == 28)
                            {
                                table.Rows[j].MergeCells(0, 5);
                            }
                            if (cellcount == 30)
                            {
                                table.Rows[j].MergeCells(0, 3);
                            }
                            if (cellcount == 31)
                            {
                                table.Rows[j].MergeCells(0, 2);
                            }
                            //合成1
                            var p = table.Rows[j].Cells[k].Paragraphs.First();
                            p.ReplaceText(p.Text, dt.DefaultView[j][k].ToString());
                            table.Rows[j].Height = 50;
                        }
                        else
                        {
                            if (k <= cellcount)
                            {
                                var p = table.Rows[j].Cells[k].Paragraphs.First();
                                p.ReplaceText(p.Text, dt.DefaultView[j][k].ToString());
                            }
                        }
                    }
                    //二格的
                    if (j == 1 || j == 2 || j == 3 || j == 9 || j == 10 || j == 11 || j == 17 || j == 18 || j == 19 || j == 20 || j == 21 || j == 22 || j == 23)
                    {
                        if (k == 1)
                        {
                            if (cellcount == 28)
                            {
                                table.Rows[j].MergeCells(1, 4);
                            }
                            if (cellcount == 30)
                            {
                                table.Rows[j].MergeCells(1, 2);
                            }
                            if (j == 3)
                            {
                                table.Rows[j].Height = 180;
                            }
                            else if (j == 9 || j == 10)
                            {

                                table.Rows[j].Height = 70;
                            }
                            else if (j == 18 || j == 19 || j == 20 || j == 21 || j == 22 || j == 23)
                            {

                                table.Rows[j].Height = 50;
                            }
                            else
                            {
                                table.Rows[j].Height = 80;
                            }
                            //合成1
                        }
                        if (k <= cellcount + 1)
                        {
                            //合成1
                            var p = table.Rows[j].Cells[k].Paragraphs.First();
                            p.ReplaceText(p.Text, dt.DefaultView[j][k].ToString());
                        }
                    }
                    //三格的
                    if (j == 4 || j == 5 || j == 6 || j == 7 || j == 8 || j == 12 || j == 13 || j == 14 || j == 15 || j == 16)
                    {
                        if (k == 1)
                        {
                            if (cellcount == 28)
                            {
                                table.Rows[j].MergeCells(2, 5);
                            }
                            if (cellcount == 30)
                            {
                                table.Rows[j].MergeCells(2, 3);
                            }
                            if (j == 7)
                            {
                                table.Rows[j].Height = 100;
                            }

                            if (j == 7)
                            {
                                table.Rows[j].Height = 100;
                            }
                            else if (j == 13)
                            {
                                table.Rows[j].Height = 30;
                            }
                            else if (j == 12 || j == 14 || j == 15 || j == 16)
                            {
                                table.Rows[j].Height = 120;
                            }
                            else
                            {
                                table.Rows[j].Height = 50;
                            }
                            //合成1
                        }
                        if (k <= cellcount + 2)
                        {
                            //合成1
                            var p = table.Rows[j].Cells[k].Paragraphs.First();
                            p.ReplaceText(p.Text, dt.DefaultView[j][k].ToString());
                        }
                    }
                }
            }
        }
        public void FillBasicInfoTable(int tableIndex, DataTable dt)
        {
            var table = document.Tables[tableIndex];
            for (var i = 0; i < dt.Columns.Count; i++)
            {
                DataColumn dc = dt.Columns[i];
                table.InsertColumn();
            }
            for (var j = 0; j < dt.Rows.Count; j++)
            {
                for (var k = 1; k < table.ColumnCount; k++)
                {
                    if (j == 1 || j == 2 || j == 3 || j == 4 || j == 5)
                    {
                        if (k == 1)
                        {

                            var p = table.Rows[j].Cells[k].Paragraphs.First();
                            p.Alignment = Alignment.left;
                            p.ReplaceText(p.Text, dt.DefaultView[j][k - 1].ToString());
                            p.FontSize(7);
                            if (table.ColumnCount > 2)
                            {
                                table.Rows[j].MergeCells(k, table.ColumnCount - 1);
                            }
                            table.Rows[j].Height = 20;
                            break;
                        }
                    }
                    else
                    {
                        var p = table.Rows[j].Cells[k].Paragraphs.First();
                        p.Alignment = Alignment.center;
                        p.ReplaceText(p.Text, dt.DefaultView[j][k - 1].ToString());
                        p.FontSize(7);
                        table.Rows[j].Height = 20;
                    }

                }
            }
        }

        public void FillNutritionCateRecTable(int tableIndex, DataTable dt)
        {
            var table = document.Tables[tableIndex];
            for (var i = 0; i < dt.Columns.Count; i++)
            {
                table.InsertColumn();
            }
            for (var j = 0; j < dt.Rows.Count; j++)
            {
                for (var k = 2; k < table.ColumnCount; k++)
                {

                    var p = table.Rows[j].Cells[k].Paragraphs.First();
                    p.Alignment = Alignment.left;
                    p.ReplaceText(p.Text, dt.DefaultView[j][k - 2].ToString());
                }
            }
            table.Rows[0].MergeCells(0, 1);
            table.Rows[dt.Rows.Count - 1].MergeCells(0, 1);
        }

        public void FillUnplanTable(int tableIndex, DataTable dt)
        {
            var table = document.Tables[tableIndex];
            for (var i = 0; i < dt.Columns.Count; i++)
            {
                table.InsertColumn();
            }
            for (var j = 0; j < dt.Rows.Count; j++)
            {
                for (var k = 2; k < table.ColumnCount; k++)
                {

                    var p = table.Rows[j].Cells[k].Paragraphs.First();
                    p.Alignment = Alignment.left;
                    p.ReplaceText(p.Text, dt.DefaultView[j][k - 2].ToString());
                }
                table.Rows[j].MergeCells(0, 1);
            }
        }

        public void FillBioTable(int tableIndex, DataTable dt)
        {
            var table = document.Tables[tableIndex];
            for (var i = 0; i < dt.Columns.Count; i++)
            {
                table.InsertColumn();
            }
            for (var j = 0; j < dt.Rows.Count; j++)
            {
                for (var k = 2; k < table.ColumnCount; k++)
                {

                    var p = table.Rows[j].Cells[k].Paragraphs.First();
                    p.Alignment = Alignment.left;
                    p.ReplaceText(p.Text, dt.DefaultView[j][k - 2].ToString());
                }
            }
            table.Rows[0].MergeCells(0, 1);
        }

        /// <summary>
        /// 根据目的Tabel动态添加新的Table，并填充数据
        /// </summary>
        /// <param name="tableIndex"></param>
        /// <param name="list"></param>
        public void FillTable(int tableIndex, List<Dictionary<string, string>> list)
        {
            var table = document.Tables[tableIndex];
            for (int i = 1; i < list.Count; i++)
            {
                document.InsertTable(table);
                document.InsertParagraph();
            }
            for (int i = 0; i < list.Count; i++)
            {
                table = document.Tables[i];
                var ps = table.Paragraphs;
                var dict = list[i];
                foreach (var p in ps)
                {
                    if (dict.ContainsKey(p.Text))
                    {
                        p.ReplaceText(p.Text, dict[p.Text]);
                    }
                }
            }
        }

        /// <summary>
        /// 根据目的Tabel动态添加新的Table，并填充数据(扩展)
        /// </summary>
        /// <param name="tableIndex">tableIndex</param>
        /// <param name="list">list</param>
        /// <param name="doc">doc</param>
        /// <param name="codeType">类型</param>
        public void FillTable(int tableIndex, List<Dictionary<string, string>> list, WordDocument doc, string codeType)
        {
            var table = document.Tables[tableIndex];
            for (int i = 1; i < list.Count; i++)
            {
                document.InsertTable(table);
                document.InsertParagraph();
            }
            for (int i = 0; i < list.Count; i++)
            {
                table = document.Tables[i];
                var ps = table.Paragraphs;
                var dict = list[i];
                foreach (var p in ps)
                {
                    if (dict.ContainsKey(p.Text))
                    {
                        p.ReplaceText(p.Text, dict[p.Text]);
                    }
                }
                //扩展不在单元格时，文本替换
                if (codeType == "PrsSoreReport" || codeType == "ColeScaleReport")
                {
                    doc.ReplaceText("OneEvaluateTotal", dict["OneEvaluateTotal"]);
                    doc.ReplaceText("EvaluateTotal", dict["EvaluateTotal"]);
                }
            }
        }

        public void FillChartData(int chartIndex, DataTable dt)
        {
            this.FillChartData(chartIndex, dt, 0);
        }

        public void InsertImage(string keyWord, string imagePath, int width, int height)
        {
            var Paragraphs = this.document.Paragraphs;
            //给文档添加1个图像
            Novacode.Image img = document.AddImage(imagePath);
            //将图像插入到段落后面
            Picture pic = img.CreatePicture(height, width);
            //设置图片形状，并水平翻转图片
            pic.SetPictureShape(RectangleShapes.rect);//(BasicShapes.cube);
            pic.FlipHorizontal = false;//不反转
            List<Novacode.Paragraph> removes = new List<Novacode.Paragraph>();
            foreach (Novacode.Paragraph p in Paragraphs)
            {
                List<int> indexes = p.FindAll(keyWord);
                if (indexes.Count > 0)
                {
                    p.InsertPicture(pic, 0);
                    p.ReplaceText(keyWord, "");
                }
            }
        }

        public void FillChartData(int chartIndex, DataTable dt, int categoryTextLength)
        {
            var chart = document.Charts[chartIndex];
            var series = chart.Series;
            MemoryStream stream = new MemoryStream();
            stream.Write(chart.ExcelFileBytes, 0, chart.ExcelFileBytes.Length);
            stream.Position = 0;
            IWorkbook book = new XSSFWorkbook(stream);
            ISheet sheet = book.GetSheetAt(0);
            int lastRowNum = sheet.LastRowNum;
            int lastColNum = sheet.GetRow(0).LastCellNum;
            Dictionary<string, List<string>> seriesData = new Dictionary<string, List<string>>();
            for (int j = 0; j < dt.Columns.Count; j++)
            {
                seriesData.Add(j.ToString(), new List<string>());
            }
            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                IRow row = sheet.GetRow(i + 1);
                if (row == null)
                {
                    row = sheet.CopyRow(1, i + 1);
                }
                for (int j = 0; j < dt.Columns.Count; j++)
                {
                    switch (dt.Columns[j].DataType.FullName)
                    {
                        case "System.Double":
                            row.Cells[j].SetCellValue(Convert.ToDouble(dr[j]));
                            break;
                        default:
                            row.Cells[j].SetCellValue(dr[j].ToString());
                            break;
                    }
                    var list = seriesData[j.ToString()];
                    if (j == 0 && categoryTextLength > 0)
                    {
                        if (dr[j].ToString().Length > categoryTextLength)
                        {
                            list.Add(dr[j].ToString().Substring(0, categoryTextLength) + "..");
                        }
                        else
                        {
                            list.Add(dr[j].ToString());
                        }

                    }
                    else
                    {
                        list.Add(dr[j].ToString());
                    }
                }
            }
            int seriesIndex = 1;
            foreach (var item in series)
            {
                item.Bind(seriesData["0"], seriesData[seriesIndex.ToString()]);
                seriesIndex++;
            }
            stream.Close();
            stream.Dispose();

            //转为字节数组
            stream = new MemoryStream();
            book.Write(stream);
            chart.ExcelFileBytes = stream.ToArray();
            stream.Close();
            stream.Dispose();
        }

        public string SavePDF()
        {
            MemoryStream stream = new MemoryStream();
            document.SaveAs(stream);
            stream.Position = 0;
            Aspose.Words.Document doc = new Aspose.Words.Document(stream);
            string fileName = DateTime.Now.ToString("yyyyMMddhhmmssfff");
            string filePath = string.Format(@"{0}{1}.pdf", this.configManager.getConfig("path.pdf"), fileName);
            doc.Save(filePath, Aspose.Words.SaveFormat.Pdf);
            return fileName + ".pdf";
        }

        public string SaveDoc()
        {
            MemoryStream stream = new MemoryStream();
            document.SaveAs(stream);
            stream.Position = 0;
            Aspose.Words.Document doc = new Aspose.Words.Document(stream);
            string fileName = DateTime.Now.ToString("yyyyMMddhhmmssfff");
            string filePath = string.Format(@"{0}{1}.doc", this.configManager.getConfig("path.doc"), fileName);
            doc.Save(filePath, Aspose.Words.SaveFormat.Doc);
            return filePath;
        }
        public string SaveDoc(string _fileName)
        {
            MemoryStream stream = new MemoryStream();
            document.SaveAs(stream);
            stream.Position = 0;
            Aspose.Words.Document doc = new Aspose.Words.Document(stream);
            string fileName = _fileName + "_" + DateTime.Now.ToString("yyyyMMddhhmmssfff");
            string filePath = string.Format(@"{0}{1}.doc", this.configManager.getConfig("path.doc"), fileName);
            doc.Save(filePath, Aspose.Words.SaveFormat.Doc);
            return filePath;
        }

        public string SaveMarkDoc(string _fileName)
        {
            MemoryStream stream = new MemoryStream();
            document.RemoveEndMark();
            document.SaveAs(stream);
            stream.Position = 0;
            Aspose.Words.Document doc = new Aspose.Words.Document(stream);
            string fileName = _fileName + "_" + DateTime.Now.ToString("yyyyMMddhhmmssfff");
            string filePath = string.Format(@"{0}{1}.doc", this.configManager.getConfig("path.doc"), fileName);
            doc.Save(filePath, Aspose.Words.SaveFormat.Doc);
            return filePath;
        }



        #region 批量相同模板的DocX文件合成一份文件
        //加载模板
        public void LoadModelDoc(string templateName)
        {
            string mapPath = HttpContext.Current.Server.MapPath(VirtualPathUtility.GetDirectory("~"));
            string path = string.Format(@"{0}Templates\{1}.docx", mapPath, templateName);

            var nextPageBrakerTemplate = string.Format(@"{0}Templates\{1}.docx", mapPath, "_NextPageBreaker");
            var nextPageBreakerDocX = DocX.Load(nextPageBrakerTemplate);
            if (null == nextPageBreakerDocX
                || null == nextPageBreakerDocX.Paragraphs
                || nextPageBreakerDocX.Paragraphs.Count < 2)
            {
                throw new Exception("Failed to Load NextPageBreaker");
            }

            this.nextPageBreaker = nextPageBreakerDocX.Paragraphs[0];

            partDocumentModel = DocX.Load(path);
            this.configManager = new FlexPaperConfig(mapPath);
        }

        //实例化模板
        public void NewPartDocument()
        {
            this.partDocument = partDocumentModel.Copy();
        }
        //替换Text
        public void ReplacePartText(string searchValue, string newValue)
        {
            this.partDocument.ReplaceText(string.Format("{0}", searchValue), newValue);
        }

        public void FillPartTable(int tableIndex, DataTable dt, string end = "", string start = "", int startRow = 0)
        {
            var table = this.partDocument.Tables[tableIndex];

            for (int i = 0; i < dt.Rows.Count; i++)
            {
                DataRow dr = dt.Rows[i];
                Row row;
                if (table.Rows.Count > i + startRow)
                {
                    row = table.Rows[i + startRow];
                }
                else
                {
                    row = table.InsertRow(table.Rows[startRow]);
                }
                for (int j = 0; j < dt.Columns.Count; j++)
                {

                    //table.Rows[0].MergeCells(0, 3);
                    var p = row.Cells[j].Paragraphs.First();
                    if (j == 0)
                    {
                        p.ReplaceText(p.Text, start + dr[j] + end);
                    }
                    else
                    {
                        p.ReplaceText(p.Text, dr[j].ToString());
                    }

                }
            }
        }

        public void BindReportData(object obj)
        {
            var t = obj.GetType();
            foreach (var field in t.GetProperties())
            {
                if (field.PropertyType == typeof(DateTime?) || field.PropertyType == typeof(DateTime))
                {
                    ReplacePartText(field.Name, field.GetValue(obj) == null ? "" : ((DateTime)field.GetValue(obj)).ToString("yyyy-MM-dd"));
                }
                else
                {
                    ReplacePartText(field.Name, field.GetValue(obj) == null ? "" : field.GetValue(obj).ToString());
                }

            }
        }

        //往导出Word 添加当前模板的word
        public void AddPartDocument()
        {
            if (this.document == null)
            {
                this.document = this.partDocument;
            }
            else
            {
                this.document.InsertParagraph(this.nextPageBreaker);
                this.document.InsertDocument(this.partDocument, true);
            }

        }
        //要导出的document是否是null
        public bool IsDocNull()
        {
            if (this.document == null)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
        #endregion
    }

    public static class DocXExtension
    {
        private const string DefaultEndMarkText = "@EndMark";
        public static void RemoveEndMark(this DocX doc)
        {
            RemoveEndMark(doc, DefaultEndMarkText);
        }

        public static void RemoveEndMark(this DocX doc, string endMarkText)
        {
            var toRemoveParagraphs = doc.Paragraphs.Where(x => x.Text == endMarkText);
            foreach (var p in toRemoveParagraphs)
                doc.RemoveParagraph(p);
        }
    }
}
