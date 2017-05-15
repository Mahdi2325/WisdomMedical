using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Interface
{
    public interface IVolunteerService : IBaseService
    {
        BaseResponse<IList<VolunteerModel>> QueryVolunteer(BaseRequest<VolunteerFilter> request);
        BaseResponse<IList<GroupActivityCategory>> QueryGroupActivity(BaseRequest<GroupActivityCategoryFilter> request);
        BaseResponse<IList<GroupActivityRecord>> QueryGroupActivityRecord(BaseRequest<GroupActivityRecordFilter> request);
        BaseResponse<IList<GroupActivityTask>> QueryGroupActivityTask(BaseRequest<GroupActivityTaskFilter> request);
    }
}
