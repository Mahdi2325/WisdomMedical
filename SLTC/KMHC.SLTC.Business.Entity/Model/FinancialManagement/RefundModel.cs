using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.FinancialManagement
{
    public partial class RefundModel 
    {
        public decimal RefundAmt { get; set; }
        public string Payer { get; set; }
        public string PaymentType { get; set; }
        public string RefundReason { get; set; }
        
    }
}
