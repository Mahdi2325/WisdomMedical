using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Web.Http;
using KM.Common;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.WebAPI.Lib.Attribute;

namespace KMHC.SLTC.WebAPI.Lib.Sequence
{
    [RoutePrefix("api/SerialAdjustment"), RoleBaseAuthorize]
    public class SerialAdjustmentController : BaseApiController
    {
        ISequenceService service = IOCContainer.Instance.Resolve<ISequenceService>();

        [Route("GetPatientQueueForAdjust"),HttpGet]
        public IHttpActionResult GetPatientQueueForAdjust([FromUri]BaseRequest<PatientQueueModel> request)
        {
            var response = service.GetPatientQueueForAdjust(request);
            return Ok(response);
        }

        [Route("GetExpiredPatientList"), HttpGet]
        public IHttpActionResult GetExpiredPatientList([FromUri]BaseRequest<PatientQueueModel> request)
        {
            var response = service.GetExpiredPatientList(request);
            return Ok(response);
        }

        [Route("SetPatientNumberForward"), HttpPost]
        public IHttpActionResult SetPatientNumberForward([FromBody] PatientQueueModel patient)
        {
            var response = service.SetPatientNumberForward(patient);
            return Ok(response);
        }

        [Route("SetPatientNumberBackward"), HttpPost]
        public IHttpActionResult SetPatientNumberBackward([FromBody] PatientQueueModel patient)
        {
            var response = service.SetPatientNumberBackward(patient);
            return Ok(response);
        }

        [Route("SetPatientNumberToFirst"), HttpPost]
        public IHttpActionResult SetPatientNumberToFirst([FromBody] PatientQueueModel patient)
        {
            var response = service.SetPatientNumberToFirst(patient);
            return Ok(response);
        }

        [Route("AddExpiredPatientToQueue"),HttpPost]
        public IHttpActionResult AddExpiredPatientToQueue([FromBody] PatientQueueModel patient)
        {
            var response = service.AddExpiredPatientToQueue(patient);
            return Ok(response);
        }

    }
}
