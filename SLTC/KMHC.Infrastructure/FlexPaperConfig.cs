using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Xml;

namespace KMHC.Infrastructure
{
    public class FlexPaperConfig
    {
        private XmlDocument _doc;
        private XmlNode _rootNode;

        public FlexPaperConfig(String mapPath)
        {
            _doc = new XmlDocument();
            _doc.Load(mapPath + @"FlexPaper.config");
            _rootNode = _doc.DocumentElement;
        }

        public void setConfig(String key, String value)
        {
            if(value==null || (value!=null && value.Length==0)){return;}

            if (_rootNode.SelectSingleNode(key) == null || (_rootNode.SelectSingleNode(key) != null && _rootNode.SelectSingleNode(key).ChildNodes.Count == 0))
            {
                XmlElement newNode = _doc.CreateElement(key);
                newNode.InnerText = value;
                _rootNode.AppendChild(newNode);
            }
            else
            {
                _rootNode.SelectSingleNode(key).ChildNodes[0].InnerText = value;
            }
        }

        public String getConfig(String key)
        {
            if (_rootNode.SelectSingleNode(key) != null)
                if (_rootNode.SelectSingleNode(key).ChildNodes.Count > 0)
                    return _rootNode.SelectSingleNode(key).ChildNodes[0].Value;
                else
                    return "";
            else
                return null;
        }

        public Boolean SaveConfig(String mapPath)
        {
	        try
	        {
                _doc.Save(mapPath + @"FlexPaper.config");
            	return true;
            }catch{
            	return false;
            }
        }
    }
}
