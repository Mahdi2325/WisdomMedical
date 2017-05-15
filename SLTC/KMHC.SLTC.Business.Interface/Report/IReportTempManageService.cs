using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Interface
{
    public interface IReportTempManageService : IBaseService
    {
        object GetPayment(int operatorId, int currentPage, int pageSize, DateTime date);
    }
}
