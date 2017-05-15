using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.Sequence
{
    public class PersonQueue
    {
        public PersonQueue(string bc,string uri)
        {
            broadcartContent = bc;
            url = uri;
        }
        /// <summary>
        /// 屏幕显示内筒
        /// </summary>
        public string broadcartContent { get; set; }

        /// <summary>
        /// 百度TTS  播报URL
        /// </summary>
        public string url { get; set; }
    }
}
