using AutoMapper;
using KM.Common;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Persistence;
using KMHC.SLTC.Repository.Base;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using EntityFramework.Extensions;
using KMHC.Infrastructure.Common;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model.Report;
using NPOI.SS.Formula.Functions;
using NPOI.Util;

namespace KMHC.SLTC.Business.Implement
{
    public class  ReportManageService : BaseService, IReportManageService
    {
        public BaseResponse<IList<ReportModel>> QueryReport(BaseRequest<ReportFilter> request)
        {
            //var q = from r in unitOfWork.GetRepository<SYS_REPORT>().dbSet
            //        select r;

            //if (!string.IsNullOrEmpty(request.Data.Code))
            //{
            //    q = q.Where(it => it.CODE == request.Data.Code);
            //}
            //if (!string.IsNullOrEmpty(request.Data.Name))
            //{
            //    q = q.Where(it => it.NAME == request.Data.Name);
            //}
            //if (!string.IsNullOrEmpty(request.Data.MajorType))
            //{
            //    q = q.Where(it => it.MAJORTYPE == request.Data.MajorType);
            //}
            //if (!string.IsNullOrEmpty(request.Data.ReportType))
            //{
            //    q = q.Where(it => it.REPORTTYPE == request.Data.ReportType);
            //}
            //if (!string.IsNullOrEmpty(request.Data.SysType))
            //{
            //    q = q.Where(it => it.SYSTYPE == request.Data.SysType);
            //}
            //if (!string.IsNullOrEmpty(request.Data.OrgId))
            //{
            //    q = q.Where(it => it.ORGID == request.Data.OrgId);
            //}
            //if (request.Data.Status.HasValue)
            //{
            //    q = q.Where(it => it.STATUS == request.Data.Status);
            //}
            //q = q.Where(it => it.CODE != null);
            var response = new BaseResponse<IList<ReportModel>>();
            //response.RecordsCount = q.Count();
            //q = q.OrderBy(it => new { it.MAJORTYPE, it.NAME });
            //List<SYS_REPORT> list = null;
            //if (request != null && request.PageSize > 0)
            //{
            //    list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
            //    response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            //}
            //else
            //{
            //    list = q.ToList();
            //}
            //Mapper.CreateMap<SYS_REPORT, ReportModel>();
            //response.Data = Mapper.Map<IList<ReportModel>>(list);
            return response;
        }

        public BaseResponse<ResidentPercentageModel> GetResidentPercentage(int organizationId)
        {
            var dicRepository = from a in unitOfWork.GetRepository<SYS_Dictionary>().dbSet.Where(a => a.ItemType == "K00.016")
                join b in unitOfWork.GetRepository<SYS_DictionaryItem>().dbSet on a.DictionaryID equals b.DictionaryID
                select b;

            var q = from r in unitOfWork.GetRepository<DC_Resident>().dbSet
                join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a => !a.IsDeleted) on r.PersonID equals p.PersonID
                join a in unitOfWork.GetRepository<ORG_Area>().dbSet on r.AreaID equals a.AreaID into re
                from n in re.DefaultIfEmpty()
                join b in unitOfWork.GetRepository<ORG_Organization>().dbSet on r.OrganizationID equals b.OrganizationID
                join h in dicRepository on p.Nationality equals h.ItemCode into nl
                from i in nl.DefaultIfEmpty()
                select new
                {
                    r = r,
                    Nationality = p.Nationality,
                    NationalityName = i.ItemName,
                    CensusAddressName = p.CensusAddressName,
                    PersonName = p.Name,
                    Sex = p.Sex,
                    PhotoPath = p.PhotoPath,
                    Birthdate = p.Birthdate,
                    IdCard = p.IdCard,
                    PersonNo = p.PersonNo,
                    City = p.City,
                    Address = p.Address,
                    HouseNumber = p.HouseNumber,
                    Phone = p.Phone,
                    AreaID = n.AreaID,
                    AreaName = n.AreaName,
                    Lng = p.Lng,
                    Lat = p.Lat,
                    OrgName = b.OrgName
                };


            q = q.Where(m => m.r.OrganizationID == organizationId);
            q = q.Where(w => w.r.IsDeleted == false && w.r.Status == "I");//状态为有效

            var residentCount = q.Distinct().Count();

            var person = from p in unitOfWork.GetRepository<DC_Person>()
                    .dbSet.Where(a => a.IsDeleted == false && a.OrganizationID == organizationId)
                select new
                {
                    personNo = p.PersonID
                };


            var data = new ResidentPercentageModel()
            {
                ResidentCount = residentCount,
                NonResidentCount = person.Distinct().Count() - residentCount
            };

            return  new BaseResponse<ResidentPercentageModel>()
            {
                Data = data,
            };
        }

        public BaseResponse<IList<ServiceStatisticModel>> GetTop10Service(int organizationId)
        {
            DateTime currencyMonthFirstDay = new DateTime(DateTime.Now.Year, DateTime.Now.Month, 1);

            var orderTitleCountRepository = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationId)
                join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                    .dbSet.Where(a => a.IsDeleted == false && a.CreatedTime > currencyMonthFirstDay &&
                                      a.OrderTitle != null) on  resident.ResidentID equals  order.ResidentID
                group order by order.OrderTitle
                into g
                select new
                {
                    orderTitle = g.Key,
                    count = g.Count()
                };

            var q = from o in orderTitleCountRepository.OrderByDescending(a => a.count).Take(10)
                select new ServiceStatisticModel
                {
                    Name = o.orderTitle.Substring(0,4),
                    CountOfMonth = o.count
                };

            return new BaseResponse<IList<ServiceStatisticModel>>()
            {
                Data = q.ToList(),
            };
        }

        public BaseResponse<IList<PaymentDistributeModel>> GetPaymentDistribute(int organizationId)
        {
            var paid = EnumHelper.GetDescription(PaymentStatus.Paid);

            var orderTitleCountRepository = from resident in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.OrganizationID == organizationId)
                join order in unitOfWork.GetRepository<DC_ServiceOrder>()
                    .dbSet.Where(a => a.IsDeleted == false && a.PaymentStatus == paid &&
                                      a.Payment != null) on resident.ResidentID equals order.ResidentID
                group order by order.Payment
                into g
                select new
                {
                    payment = g.Key,
                    amount = g.Sum(a=>a.Price)
                };

            var q = from o in orderTitleCountRepository.OrderBy(a=>a.payment)
                    select new PaymentDistributeModel
                {
                    Payment = o.payment =="Cash"?"现金":"会员卡",
                    Amount = o.amount
                };

            return new BaseResponse<IList<PaymentDistributeModel>>()
            {
                Data = q.ToList(),
            };
        }

        public BaseResponse<IList<ResidentAgeModel>> GetResidentAgeDistribute(int organizationId)
        {

            var ageIdRepository = from p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a => a.IsDeleted == false && a.Birthdate !=null)
                join r in unitOfWork.GetRepository<DC_Resident>()
                    .dbSet.Where(a => a.IsDeleted == false) on p.PersonID equals r.PersonID
                select new
                {
                    Id = DateTime.Now.Year - p.Birthdate.Value.Year > 79
                        ? 5
                        : (DateTime.Now.Year - p.Birthdate.Value.Year > 69
                            ? 4
                            : (DateTime.Now.Year - p.Birthdate.Value.Year > 64
                                ? 3
                                : (DateTime.Now.Year - p.Birthdate.Value.Year > 59 ? 2 : 1
                                ))),
                    Birthday = p.Birthdate
                };

            var result = from r in ageIdRepository.OrderBy(a => a.Id)
                group r by r.Id
                into g
                select new ResidentAgeModel()
                {
                    AgeArea = g.Key == 5
                        ? "80 ~   "
                        : (g.Key == 4 ? "70 ~ 79" : (g.Key == 3 ? "65 ~ 69" : (g.Key == 2 ? "60 ~ 64" : "   ~ 59"))),
                    Count = g.Count()
                };

            return new BaseResponse<IList<ResidentAgeModel>>()
            {
                Data = result.OrderBy(a=>a.AgeArea).ToList(),
            };
        }

    }
}
