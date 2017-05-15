using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;

namespace KMHC.SLTC.Business.Interface.Sequence
{
    public interface ISequenceService
    {
        BaseResponse<PatientCollection> GetPatientQueueForCallPatient(BaseRequest<PatientQueueModel> request);
        BaseResponse<PatientCollection> GetPatientQueueForCallPatient(int dept, int? organizationId, int checkRoomId);

        BaseResponse<PatientCollection> UpdatePatientStatus(PatientQueueModel patient);

        BaseResponse<PatientCollection> SetPatientQueueExpired(PatientQueueModel patient);

        BaseResponse<PatientCollection> SetPatientCheckFinish(PatientQueueModel patient);

        BaseResponse<IList<PatientQueueModel>> GetPatientQueueForAdjust(BaseRequest<PatientQueueModel> request);

        BaseResponse<IList<PatientQueueModel>> GetExpiredPatientList(BaseRequest<PatientQueueModel> request);

        BaseResponse<bool> SetPatientNumberForward(PatientQueueModel patient);

        BaseResponse<bool> SetPatientNumberBackward(PatientQueueModel patient);

        BaseResponse<bool> SetPatientNumberToFirst(PatientQueueModel patient);

        BaseResponse<bool> AddExpiredPatientToQueue(PatientQueueModel patient);

        PatientQueueModel GetCheckRoomName(PatientQueueModel patient);
    }
}
