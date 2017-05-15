using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class BriefInfoModel
    {
        public int UnDistributeTaskCount { get; set; }
        public int TodayUnDealTaskCount { get; set; }
        public int HistoryUnDealTaskCount { get; set; }
        public int RequireReturnVisitTaskCount { get; set; }

        /// <summary>
        /// 待退款订单审核数
        /// </summary>
        public int NeedAuditRefundOrderCount { get; set; }

        public int SelfPickupOrderCount { get; set; }

        /// <summary>
        /// 待审核工单改签数
        /// </summary>
        public int NeedChangeAuditOrderCount { get; set; }
    }
}
