namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    public partial class EvaluationService : BaseService, IEvaluationService
    {
        #region DC_Evaluation
        public BaseResponse<IList<EvaluationModel>> QueryEvaluation(BaseRequest<EvaluationFilter> request)
        {
            var response = new BaseResponse<IList<EvaluationModel>>();
            var q = from a in unitOfWork.GetRepository<DC_Evaluation>().dbSet
                    join b in unitOfWork.GetRepository<DC_Person>().dbSet on a.CreateBy equals b.PersonID
                    select new EvaluationModel
                    { 
                        ID = a.ID,
                        EmployeeID = a.EmployeeID,
                        ServiceOrderID = a.ServiceOrderID,
                        Mark = a.Mark,
                        Content = a.Content,
                        CreateByName = b.Name,
                        CreateTime =a.CreateTime                        
                    };

            if (request.Data.EmployeeID.HasValue)
            {
                q = q.Where(m => m.EmployeeID == request.Data.EmployeeID.Value);
            }

            if (request.Data.ServiceOrderID.HasValue)
            {
                q = q.Where(m => m.ServiceOrderID == request.Data.ServiceOrderID.Value);
            }
            q = q.OrderByDescending(m => m.CreateTime);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }
            else
            {
                var list = q.ToList();
                response.Data = list;
            }            
            return response;
        }

        public BaseResponse<IList<EmpEvlModel>> QueryEmpWithEvluation(BaseRequest<EmployeeFilter> request)
        {
            var response = new BaseResponse<IList<EmpEvlModel>>();
            if (request == null || request.Data == null)
            {
                return new BaseResponse<IList<EmpEvlModel>>();
            }

            var evaRepository = from a in unitOfWork.GetRepository<DC_Evaluation>().dbSet
                                group a by a.EmployeeID into g
                                select new
                                {
                                    EmployeeID = g.Key,
                                    EvlCount = g.Count(),
                                    EvlSum = g.Sum(a => a.Mark)
                                };

            var serRepository = from a in unitOfWork.GetRepository<DC_Task>().dbSet.Where(a => a.Status == "Finish")
                                group a by a.EmployeeId into g
                                select new
                                {
                                    EmployeeID = g.Key,
                                    SerCount = g.Count()
                                };


            var q = from a in unitOfWork.GetRepository<ORG_Employee>().dbSet.Where(a=>request.Data.JobTitle.Contains(a.JobTitle) && a.OrganizationID==request.Data.OrganizationID)
                    join b in evaRepository on a.EmployeeID equals b.EmployeeID into empevl
                    from n in empevl.DefaultIfEmpty()
                    join c in serRepository on a.EmployeeID equals c.EmployeeID into empser
                    from m in empser.DefaultIfEmpty()
                    select new EmpEvlModel
                    {
                        EmployeeID = a.EmployeeID,
                        EmpNo = a.EmpNo,
                        EmpName = a.EmpName,
                        PhotoPath = a.PhotoPath,
                        Sex = (a.Sex == "1" ? "男" : "女"),
                        BirthDate = a.Birthdate,
                        EvlCount = n.EvlCount,
                        Mark = ((n.EvlSum.HasValue && n.EvlCount!=0) ? n.EvlSum.Value/n.EvlCount:0),
                        SerCount = m.SerCount
                    };

            if (request.Data.EmployeeID != 0)
            {
                q = q.Where(m => m.EmployeeID == request.Data.EmployeeID);
            }
            if (request.Data.EmployeeIDs != null && request.Data.EmployeeIDs.Length > 0)
            {
                q = q.Where(m => request.Data.EmployeeIDs.Contains(m.EmployeeID));
            }
            if (!string.IsNullOrWhiteSpace(request.Data.EmpNo))
            {
                q = q.Where(m => m.EmpNo.Contains(request.Data.EmpNo));
            }
            if (!string.IsNullOrWhiteSpace(request.Data.EmpName))
            {
                q = q.Where(m => m.EmpName.Contains(request.Data.EmpName));
            }
            if (!string.IsNullOrWhiteSpace(request.Data.SearchWords))
            {
                q = q.Where(m => m.EmpNo.Contains(request.Data.SearchWords) || m.EmpName.Contains(request.Data.SearchWords));
            }
            q = q.OrderByDescending(a => new { a.Mark, a.EvlCount });
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }
            else
            {
                var list = q.ToList();
                response.Data = list;
            }

            foreach (var emp in response.Data)
            {
                if (emp.BirthDate.HasValue)
                {
                    emp.Age =  DateTime.Now.Year - emp.BirthDate.Value.Year;
                }
                emp.Mark = Convert.ToSingle(Math.Round(emp.Mark, 2));
            }

            return response;
        }

        public BaseResponse<EvaluationModel> GetEvaluation(int evaluationID)
        {
            return base.Get<DC_Evaluation, EvaluationModel>((q) => q.ID == evaluationID);
        }

        public BaseResponse<EvaluationModel> SaveEvaluation(EvaluationModel request)
        {
            return base.Save<DC_Evaluation, EvaluationModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteEvaluation(int evaluationID)
        {
            return base.Delete<DC_Evaluation>(evaluationID);
        }
        #endregion
    }
}
