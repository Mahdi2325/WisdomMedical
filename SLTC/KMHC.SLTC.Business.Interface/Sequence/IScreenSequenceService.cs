using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Interface.Sequence
{
    public interface IScreenSequenceService : IBaseService
    {
        /// <summary>
        /// 获取屏幕显示列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<ScreenDisplayModel>> QueryScreenList(int deptid = 0, int start = 0, int leng = -1);

        BaseResponse<IList<OrganizationModel>> QueryOrg();


    }
}
