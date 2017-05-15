using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Entity.Model.Home;

namespace KMHC.SLTC.Business.Interface
{
    public interface IBriefInfoService : IBaseService
    {
        BaseResponse<BriefInfoModel> GetBriefInfo(int organizationId);

        BaseResponse<TodayInfoModel> GetTodayInfo(int organizationId);
    }
}
