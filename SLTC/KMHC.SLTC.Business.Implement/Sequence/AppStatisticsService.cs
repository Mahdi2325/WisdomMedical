using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.Persistence;

namespace KMHC.SLTC.Business.Implement.Sequence
{
    public class AppStatisticsService : BaseService, IAppStatisticsService
    {
        public BaseResponse<AppointStatistics> GetAppPeopleByDateTime(DateTime dt)
        {
            var q = from c in unitOfWork.GetRepository<DC_ServiceAppointment>()
                    .dbSet.Where(a => a.ServiceDate == dt)
                    join b in unitOfWork.GetRepository<DC_SerAppSerIt>().dbSet on c.ServiceAppID equals b.ServiceAppID
                    select new ServiceAppointment 
                {
                    ServiceItemType=b.SIName,
                    AppBy=c.AppBy,
                    AppTime=c.AppTime

                };
            var collection = new AppointStatistics();
            collection.ServicePeople = q.ToList();

            return new BaseResponse<AppointStatistics>()
            {
                Data = collection
            };
        }
        public BaseResponse<AppointStatistics> GetAppPeopleBySevAndTime(string sevItem,DateTime dt,string period)
        {
            var q = from c in unitOfWork.GetRepository<DC_ServiceAppointment>()
                    .dbSet.Where(a => a.ServiceDate == dt)
                    join b in unitOfWork.GetRepository<DC_SerAppSerIt>().dbSet.Where(a => a.SIName == sevItem) on c.ServiceAppID equals b.ServiceAppID
                    select new ServiceAppointment
                    {
                        ServiceItemType = b.SIName,
                        AppBy = c.AppBy,
                        AppTime = c.AppTime,
                        AppPhone=c.AppPhone

                    };
            if (period == "Morn")
            {
                string tmp = dt.ToShortDateString() + " 12:00:00";
                DateTime cmp = DateTime.Parse(tmp);
                q = q.Where(a => a.AppTime <= cmp);
            }
            if (period == "Noon")
            {
                string tmp = dt.ToShortDateString() + " 12:00:00";
                DateTime cmp = DateTime.Parse(tmp);
                q = q.Where(a => a.AppTime > cmp);
            }
            var collection = new AppointStatistics();
            collection.ServicePeople = q.ToList();

            return new BaseResponse<AppointStatistics>()
            {
                Data = collection
            };
        }
    }
}
