using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Interface
{
    public interface IResidentCareService : IBaseService
    {
        BaseResponse<List<Pressure>> GetPressureInfo(string IMEI);
        BaseResponse<List<BloodSugar>> GetBloodSugarInfo(string IMEI);
        BaseResponse<List<HeartRate>> GetHeartRateInfo(string IMEI);
        BaseResponse<List<Watch>> GetWatchInfo(string phone);
        BaseResponse<List<ExamRecord>> GetExamrecordInfo(int currentPage, int pageSize, string idno);
        BaseResponse<List<Examresult>> GetExamResultInfo(int examId);
        BaseResponse<PersonFile> GetFileInfo(string idno);
    }
}
