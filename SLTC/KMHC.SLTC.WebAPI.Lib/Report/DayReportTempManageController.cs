#region 文件描述
/******************************************************************
** 创建人   :BobDu
** 创建时间 :
** 说明     :
******************************************************************/
#endregion

using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI.Lib.Report
{
    [RoutePrefix("api/DayReportTempManage"), RoleBaseAuthorize]
    public class DayReportTempManageController : BaseApiController
    {
        IReportTempManageService service = IOCContainer.Instance.Resolve<IReportTempManageService>();
        [Route(""), HttpGet]
        public IHttpActionResult Get(int currentPage, int pageSize, DateTime date, int operatorId, string mark = "")
        {
            object response = null;
            switch (mark)
            {
                case "Payment":
                    response = service.GetPayment(operatorId, currentPage, pageSize, date);
                    break;
            }
            return Ok(response);
        }
    }
}
