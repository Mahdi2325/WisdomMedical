using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace KMHC.Infrastructure
{
    public class TextHelper 
    {

        public static string WriteKey(string logs)
        {
            string fileName="";
            string logFilePath = GetTextPath(out fileName);
            FileStream fs = null;
            if (!File.Exists(logFilePath))
            {
                fs = new FileStream(logFilePath, FileMode.Create);
                fs.Close();
            }
            //var wlog = File.AppendText(logFilePath);//追加
            var wlog = File.CreateText(logFilePath);
            wlog.Write(logs);
            wlog.Close();
            return fileName;

        }

        public static string GetTextPath(out string fileName)
        {
            string rootPath = HttpContext.Current.Server.MapPath(VirtualPathUtility.GetDirectory("~"));
            string filePath = string.Format(@"{0}Scripts\timeline\data\", rootPath);
            DeleteFiles(filePath);
            fileName = DateTime.Now.ToString("yyyyMMddHHmmss");
            string path = string.Format(@"{0}Scripts\timeline\data\{1}.txt", rootPath, fileName);
            return path;
        }

        /// <summary>
        /// 删除非空文件夹
        /// </summary>
        /// <param name="path">要删除的文件夹目录</param>
        static void DeleteFiles(string path)
        {
            DirectoryInfo dir = new DirectoryInfo(path);
            FileInfo[] files = dir.GetFiles();
            try
            {
                if (dir.Exists)
                {
                    foreach (var item in files)
                    {
                        if (item.Extension == ".txt")
                        {
                            File.Delete(item.FullName);
                        }
                    }
                    //if (dir.GetDirectories().Length != 0)
                    //{
                    //    foreach (var item in dir.GetDirectories())
                    //    {
                    //        if (!item.ToString().Contains("$") && (!item.ToString().Contains("Boot")))
                    //        {
                    //            DeleteFiles(dir.ToString() + "\\" + item.ToString());
                    //        }
                    //    }
                    //}
                }
              //  Directory.Delete(path);
            }
            catch (Exception)
            {  }
        }
    }
}
