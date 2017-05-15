using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Interface.baiduTTS
{
    public interface IBaiduTTSService : IBaseService
    {
        /// <summary>
        /// 获取百度TTS URI
        /// </summary>
        /// <param name="tex"></param>
        /// <returns></returns>
        string GetBaiduUri(string tex);

        /// <summary>
        /// 获取百度Token
        /// </summary>
        /// <param name="tex"></param>
        /// <returns></returns>
        string GetBaiduToken();
    }
}
