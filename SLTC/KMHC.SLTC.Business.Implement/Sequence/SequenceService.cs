using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model.Sequence;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.Persistence;

namespace KMHC.SLTC.Business.Implement.Sequence
{
    public class SequenceService : BaseService,ISequenceService
    {
        public BaseResponse<PatientCollection> GetPatientQueueForCallPatient(BaseRequest<PatientQueueModel> request)
        {
            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == request.Data.OrganizationID)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == request.Data.DeptID) on c.ServiceItemID equals s.ServiceItemID
                join d in unitOfWork.GetRepository<ORG_Dept>().dbSet on s.DeptId equals d.DeptID
                select new PatientQueueModel()
                {

                    ServiceItemID = c.ServiceItemID,
                    SIName = c.SIName,
                    EmployeeID = c.EmployeeID.Value,
                    ResidentID = c.ResidentID,
                    ResidentName = c.ResidentName,
                    SerialNumber = c.SerialNumber,
                    CheckNumber = c.CheckNumber,
                    CheckStatus = c.CheckStatus,
                    CheckRoomQueueRecID = c.CheckRoomQueueRecID,
                    OrganizationID = c.OrganizationID,
                    DeptID = d.DeptID,
                    DeptName = d.DeptName,
                    CheckRoomID = c.CheckRoomID.Value

                };

            var waitForCheck = (int)CheckStatus.WaitForCheck;
            var inChecking = (int)CheckStatus.InChecking;

            var collection = new PatientCollection();
            collection.InQueuePatientList = q.Where(a => a.CheckStatus == waitForCheck).OrderBy(a => a.CheckNumber).ToList();
            collection.InServicingPatientList = q.Where(a => a.CheckStatus == inChecking && a.CheckRoomID == request.Data.CheckRoomID).OrderBy(a => a.CheckNumber).ToList();


            var response = new BaseResponse<PatientCollection>();
            response.RecordsCount = collection.InQueuePatientList.Count;

            if (request != null && request.PageSize > 0)
            {
                collection.InQueuePatientList =collection.InQueuePatientList.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();

                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = collection;
            }

            else
            {
                response.Data = collection;
            }


            return response;
        }
        public BaseResponse<PatientCollection> GetPatientQueueForCallPatient(int deptId, int? organizationId,int checkRoomId)
        {

            var request =new BaseRequest<PatientQueueModel>();
            request.Data.DeptID = deptId;
            request.Data.OrganizationID = organizationId;
            request.Data.CheckRoomID = checkRoomId;
            request.CurrentPage = 1;
            request.PageSize = 5;

            return GetPatientQueueForCallPatient(request);

        }

        public BaseResponse<IList<PatientQueueModel>> GetPatientQueueForAdjust(BaseRequest<PatientQueueModel> request)
        {
            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == request.Data.OrganizationID)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == request.Data.DeptID) on c.ServiceItemID equals s.ServiceItemID
                join d in unitOfWork.GetRepository<ORG_Dept>().dbSet on s.DeptId equals d.DeptID
                select new PatientQueueModel()
                {

                    ServiceItemID = c.ServiceItemID,
                    SIName = c.SIName,
                    EmployeeID = c.EmployeeID.Value,
                    ResidentID = c.ResidentID,
                    ResidentName = c.ResidentName,
                    SerialNumber = c.SerialNumber,
                    CheckNumber = c.CheckNumber,
                    CheckStatus = c.CheckStatus,
                    CheckRoomQueueRecID = c.CheckRoomQueueRecID,
                    OrganizationID = c.OrganizationID,
                    DeptID = d.DeptID,
                    DeptName = d.DeptName,

                };

            var waitForCheck = (int)CheckStatus.WaitForCheck;

            q = q.Where(a => a.CheckStatus == waitForCheck).OrderBy(a => a.CheckNumber);

            var response = new BaseResponse<IList<PatientQueueModel>>();
            response.RecordsCount = q.ToList().Count;

            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();

                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }

            else
            {
                response.Data = q.ToList();
            }


            return response;

        }

        public BaseResponse<IList<PatientQueueModel>> GetExpiredPatientList(BaseRequest<PatientQueueModel> request)
        {
            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == request.Data.OrganizationID)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == request.Data.DeptID) on c.ServiceItemID equals s.ServiceItemID
                join d in unitOfWork.GetRepository<ORG_Dept>().dbSet on s.DeptId equals d.DeptID
                select new PatientQueueModel()
                {

                    ServiceItemID = c.ServiceItemID,
                    SIName = c.SIName,
                    EmployeeID = c.EmployeeID.Value,
                    ResidentID = c.ResidentID,
                    ResidentName = c.ResidentName,
                    SerialNumber = c.SerialNumber,
                    CheckNumber = c.CheckNumber,
                    CheckStatus = c.CheckStatus,
                    CheckRoomQueueRecID = c.CheckRoomQueueRecID,
                    OrganizationID = c.OrganizationID,
                    DeptID = d.DeptID,
                    DeptName = d.DeptName,

                };

            var expired = (int) CheckStatus.Expired;

            q = q.Where(a => a.CheckStatus == expired).OrderBy(a => a.CheckNumber);

            var response = new BaseResponse<IList<PatientQueueModel>>();
            response.RecordsCount = q.ToList().Count;

            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();

                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }

            else
            {
                response.Data = q.ToList();
            }


            return response;
        }

        /// <summary>
        /// Get next patient
        /// </summary>
        /// <param name="patient"></param>
        /// <returns></returns>
        public BaseResponse<PatientCollection> UpdatePatientStatus(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var waiting = (int) CheckStatus.WaitForCheck;

            var repository = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                .dbSet.Where(a => a.OrganizationID == patient.OrganizationID && a.CheckStatus == waiting &&
                                  a.DeptId == patient.DeptID)
                .OrderBy(a => a.CheckNumber);


            var firstNode = repository.FirstOrDefault();


            if (firstNode != null)
            {
                firstNode.CheckStatus = (int) CheckStatus.InChecking;
                firstNode.CheckRoomID = patient.CheckRoomID;
                firstNode.EmployeeID = patient.EmployeeID;
                firstNode.CheckBeginTime = DateTime.Now;
                unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(firstNode);

            }

            foreach (var node in repository.ToList())
            {
                node.CheckNumber--;
                unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(node);
            }

            unitOfWork.Save();

            return GetPatientQueueForCallPatient(patient.DeptID, patient.OrganizationID, patient.CheckRoomID);
        }

        public BaseResponse<PatientCollection> SetPatientQueueExpired(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var patientService = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                           && a.ResidentID == patient.ResidentID &&
                                           a.SerialNumber == patient.SerialNumber&&
                                           a.OrganizationID == patient.OrganizationID);

            if (patientService != null)
            {
                patientService.CheckStatus = (int) CheckStatus.Expired;
                unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(patientService);
                unitOfWork.Save();
            }


            return GetPatientQueueForCallPatient(patient.DeptID, patient.OrganizationID, patient.CheckRoomID);
        }

        public BaseResponse<PatientCollection> SetPatientCheckFinish(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var patientService = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                           && a.ResidentID == patient.ResidentID &&
                                           a.SerialNumber == patient.SerialNumber &&
                                           a.OrganizationID == patient.OrganizationID);

            if (patientService != null)
            {
                patientService.CheckStatus = (int)CheckStatus.Finish;
                unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(patientService);


                var patientRecord = unitOfWork.GetRepository<DC_CheckRoomQueueRec>()
                    .dbSet.FirstOrDefault(a => a.CheckRoomQueueRecID == patientService.CheckRoomQueueRecID);

                patientRecord.CheckStatus = (int) CheckStatus.Finish;
                patientRecord.CheckBeginTime = patientService.CheckBeginTime;
                patientRecord.CheckRoomID = patientService.CheckRoomID;
                patientRecord.CheckEmployeeID = patientService.EmployeeID;
                patientRecord.CheckEndTime = DateTime.Now;
                unitOfWork.GetRepository<DC_CheckRoomQueueRec>().Update(patientRecord);
            }

            #region Get Next department and target service item

            var register = (int)CheckStatus.Register;
            var waiting = (int)CheckStatus.WaitForCheck;

            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.SerialNumber == patient.SerialNumber && a.CheckStatus == register)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet on c.ServiceItemID equals s.ServiceItemID
                select new
                {
                    QueueId = c.QueueID,
                    Priorit = s.Priorit,
                    DeptID = c.DeptId
                };

            #endregion


            if (q.Any())
            {
                var queueId = q.OrderBy(a => a.Priorit).FirstOrDefault().QueueId;
                var deptId = q.OrderBy(a => a.Priorit).FirstOrDefault().DeptID;

                #region Get New queue check number

                var numQuery = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.DeptId == deptId && a.CheckStatus == waiting)
                    .OrderByDescending(a => a.CheckNumber);

                var checkNum = 1;
                if (numQuery.Any())
                {
                    checkNum = numQuery.FirstOrDefault().CheckNumber + 1;
                }

                #endregion
              

                var nextQueue = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.FirstOrDefault(a => a.QueueID == queueId);

                if (nextQueue != null)
                {
                    nextQueue.CheckStatus = (int)CheckStatus.WaitForCheck;
                    nextQueue.CheckNumber = checkNum;
                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(nextQueue);
                   
                }
            }

            unitOfWork.Save();
            return GetPatientQueueForCallPatient(patient.DeptID, patient.OrganizationID, patient.CheckRoomID);
        }

        public BaseResponse<bool> SetPatientNumberForward(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var waitForCheck = (int) CheckStatus.WaitForCheck;
            var inChecking = (int) CheckStatus.InChecking;

            //find the queueId in front of current patient in target queue
            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == patient.OrganizationID && a.CheckStatus == waitForCheck &&a.CheckNumber == patient.CheckNumber -1)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == patient.DeptID) on c.ServiceItemID equals s.ServiceItemID
                select new
                {
                    queueId = c.QueueID
                };

            if (q.Any())
            {
                var queueId = q.FirstOrDefault().queueId;
                var frontPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.FirstOrDefault(a => a.QueueID == queueId);

                var currentPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                               && a.ResidentID == patient.ResidentID &&
                                               a.OrganizationID == patient.OrganizationID&&
                                               a.SerialNumber ==patient.SerialNumber
                                               && a.CheckNumber == patient.CheckNumber);

                if (frontPatient != null && currentPatient != null)
                {
                    frontPatient.CheckNumber++;
                    currentPatient.CheckNumber--;
                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(frontPatient);
                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(currentPatient);
                    unitOfWork.Save();
                }
            }


            return new BaseResponse<bool>(){Data = true};
        }

        public BaseResponse<bool> SetPatientNumberBackward(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var waitForCheck = (int)CheckStatus.WaitForCheck;
            var inChecking = (int)CheckStatus.InChecking;

            //find the queueId in after of current patient in target queue
            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == patient.OrganizationID && a.CheckStatus == waitForCheck && a.CheckNumber == patient.CheckNumber + 1)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == patient.DeptID) on c.ServiceItemID equals s.ServiceItemID
                select new
                {
                    queueId = c.QueueID
                };

            if (q.Any())
            {
                var queueId = q.FirstOrDefault().queueId;
                var afterPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.FirstOrDefault(a => a.QueueID == queueId);

                var currentPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                               && a.ResidentID == patient.ResidentID &&
                                               a.OrganizationID == patient.OrganizationID&&
                                               a.SerialNumber ==patient.SerialNumber
                                               && a.CheckNumber == patient.CheckNumber);

                if (afterPatient != null && currentPatient != null)
                {
                    afterPatient.CheckNumber--;
                    currentPatient.CheckNumber++;
                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(afterPatient);
                    unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(currentPatient);
                    unitOfWork.Save();
                }
            }


            return new BaseResponse<bool>() { Data = true };
        }

        public BaseResponse<bool> SetPatientNumberToFirst(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var waiting = (int) CheckStatus.WaitForCheck;

            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == patient.OrganizationID && a.CheckStatus == waiting && a.CheckNumber<patient.CheckNumber)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == patient.DeptID) on c.ServiceItemID equals s.ServiceItemID
                select new
                {
                    ServiceItemID = c.ServiceItemID,
                    ResidentID = c.ResidentID,
                    OrganizationID = c.OrganizationID,
                    SerialNumber = c.SerialNumber
                };

            var currentPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                           && a.ResidentID == patient.ResidentID &&
                                           a.SerialNumber == patient.SerialNumber &&
                                           a.OrganizationID == patient.OrganizationID);

            if (currentPatient != null)
            {
                currentPatient.CheckNumber = 1;
                unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(currentPatient);

                foreach (var node in q.ToList())
                {
                    var item = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                        .dbSet.FirstOrDefault(a => a.ServiceItemID == node.ServiceItemID
                                                   && a.ResidentID == node.ResidentID &&
                                                   a.OrganizationID == node.OrganizationID
                                                   && a.SerialNumber == node.SerialNumber
                                                   && a.CheckStatus == waiting);

                    if (item != null)
                    {
                        item.CheckNumber++;
                        unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(item);

                    }

                }
            }

            unitOfWork.Save();

            return new BaseResponse<bool>() { Data = true };
        }

        public BaseResponse<bool> AddExpiredPatientToQueue(PatientQueueModel patient)
        {
            if (patient == null) return null;

            var waiting = (int)CheckStatus.WaitForCheck;

            var q = from c in unitOfWork.GetRepository<DC_CheckRoomQueue>()
                    .dbSet.Where(a => a.OrganizationID == patient.OrganizationID && a.CheckStatus == waiting)
                join s in unitOfWork.GetRepository<DC_ServiceItem>()
                    .dbSet.Where(a => a.DeptId == patient.DeptID) on c.ServiceItemID equals s.ServiceItemID
                select new
                {
                    ServiceItemID = c.ServiceItemID,
                    ResidentID = c.ResidentID,
                    OrganizationID = c.OrganizationID,
                    CheckNumber = c.CheckNumber
                };

            var topCheckNumberItem = q.OrderByDescending(a => a.CheckNumber).FirstOrDefault();
            var topCheckNumber =topCheckNumberItem == null? 1:topCheckNumberItem.CheckNumber + 1;

            var currentPatient = unitOfWork.GetRepository<DC_CheckRoomQueue>()
                .dbSet.FirstOrDefault(a => a.ServiceItemID == patient.ServiceItemID
                                           && a.ResidentID == patient.ResidentID &&
                                           a.SerialNumber == patient.SerialNumber &&
                                           a.OrganizationID == patient.OrganizationID);

            currentPatient.CheckNumber = topCheckNumber;
            currentPatient.CheckStatus = (int) CheckStatus.WaitForCheck;
            unitOfWork.GetRepository<DC_CheckRoomQueue>().Update(currentPatient);

            unitOfWork.Save();

            return new BaseResponse<bool>() { Data = true };
        }

        public PatientQueueModel GetCheckRoomName(PatientQueueModel patient)
        {
            var checking = (int) CheckStatus.InChecking;

            var q = from c in unitOfWork.GetRepository<DC_CheckRoom>().dbSet
                    join checkRoom in unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet.Where(a => a.DeptId == patient.DeptID && a.CheckStatus == checking) on c.CheckRoomID equals checkRoom.CheckRoomID
                     join d in unitOfWork.GetRepository<ORG_Dept>().dbSet on checkRoom.DeptId equals d.DeptID
                    select new PatientQueueModel
                {
                    CheckRoomName = c.CheckRoomName,
                    DeptName = d.DeptName,
                    ResidentName = checkRoom.ResidentName,
                    SerialNumber = checkRoom.SerialNumber,
                    CheckBeginTime = checkRoom.CheckBeginTime
                };


            return q.OrderByDescending(a => a.CheckBeginTime).FirstOrDefault();
        }
    }
}
