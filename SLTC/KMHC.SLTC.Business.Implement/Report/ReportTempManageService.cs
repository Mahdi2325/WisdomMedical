#region 文件描述
/******************************************************************
** 创建人   :BobDu
** 创建时间 :
** 说明     :
******************************************************************/
#endregion

using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Implement
{
    public class ReportTempManageService : BaseService, IReportTempManageService
    {
        public object GetPayment(int operatorId, int currentPage, int pageSize, DateTime date)
        {
            var startDate = date;
            var endDate = date.AddDays(1).AddSeconds(-1);
            BaseResponse<object> response = new BaseResponse<object>();
            var q = from s1 in unitOfWork.GetRepository<DC_ServiceOrderCharge>().dbSet
                    where s1.Operator == operatorId && s1.PayTime >= startDate && s1.PayTime <= endDate
                    join s2 in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet on s1.ServiceOrderID equals s2.ServiceOrderID
                    select new
                    {
                        s2.SONo,
                        s1.Price,
                        s1.PreAmount,
                        s1.PaymentType,
                        s1.ReceiveAmount
                    };
            q = q.OrderByDescending(o => o.SONo);
            response.RecordsCount = q.Count();
            var list = q.Skip((currentPage - 1) * pageSize).Take(pageSize).ToList();
            response.PagesCount = GetPagesCount(pageSize, response.RecordsCount);
            response.Data = list;
            return response;
        }
    }
}
