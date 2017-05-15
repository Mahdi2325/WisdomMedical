namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IChartService : IBaseService
    {
        BaseResponse<ChartColumnModel> GetOrgDanAnList(int? groupId);

        BaseResponse<ChartColumnModel> GetOrgHuiYuanList(int? groupId);

        BaseResponse<ChartColumnModel> GetOrgOrderList(int? groupId);

        BaseResponse<ChartMColumnModel> GetOrgTaskList(int? groupId);

        BaseResponse<ChartPieModel> GetOrgSexList(int? groupId);

        BaseResponse<ChartPieModel> GetOrgAgeList(int? groupId);

    }
}
