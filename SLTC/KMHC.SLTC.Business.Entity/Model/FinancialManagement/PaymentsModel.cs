using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model.FinancialManagement
{
    public partial class PaymentsModel 
    {
        public decimal ThisTtlAmt { get; set; }
        public string Payer { get; set; }
        public string PaymentType { get; set; }
        public string InvoiceNo { get; set; }
        public decimal CurAmount { get; set; }
        public decimal PreAmount { get; set; }
    }
}
