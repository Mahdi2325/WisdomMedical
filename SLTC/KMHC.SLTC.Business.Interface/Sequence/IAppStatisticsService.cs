using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;

namespace KMHC.SLTC.Business.Interface.Sequence
{
    public interface IAppStatisticsService
    {
        BaseResponse<AppointStatistics> GetAppPeopleByDateTime(DateTime dt);
        BaseResponse<AppointStatistics> GetAppPeopleBySevAndTime(string sev, DateTime dt,string period); 
    }
}
