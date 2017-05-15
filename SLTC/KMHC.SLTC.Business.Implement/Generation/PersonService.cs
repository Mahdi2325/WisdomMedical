namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.Infrastructure;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;
    
    public partial class PersonService : BaseService, IPersonService
    {
        #region DC_Person
        public BaseResponse<IList<PersonModel>> QueryPerson(BaseRequest<PersonFilter> request)
        {

            BaseResponse<IList<PersonModel>> response = new BaseResponse<IList<PersonModel>>();
            var q = from a in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a=>!a.IsDeleted)
                    join b in unitOfWork.GetRepository<DC_Resident>().dbSet on a.PersonID equals b.PersonID into re
                    from n in re.DefaultIfEmpty()
                    select new
                    {
                        Person = a,
                        ResidentID = n.ResidentID,
                        ResidentType= n.ResidentType
                    };

            if (request != null)
            {
                if (!string.IsNullOrEmpty(request.Data.PersonName))
                {
                    q = q.Where(m => m.Person.Name.Contains(request.Data.PersonName));
                }
                if (request.Data.PersonID != 0)
                {
                    q = q.Where(m => m.Person.PersonID == request.Data.PersonID);
                }

                if (!string.IsNullOrEmpty(request.Data.AuditState))
                {
                    q = q.Where(m => m.Person.AuditState == request.Data.AuditState);
                }
                if (!string.IsNullOrEmpty(request.Data.SearchKey))
                {
                    q = q.Where(m => m.Person.Pinyin.Contains(request.Data.SearchKey.ToUpper()) || m.Person.Name.ToUpper().Contains(request.Data.SearchKey.ToUpper()) || m.Person.Phone.Contains(request.Data.SearchKey) || m.Person.IdCard.Contains(request.Data.SearchKey));
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.Person.OrganizationID == request.Data.OrganizationID);
                }
            }
            q = q.OrderByDescending(m => m.Person.PersonID);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                var newList = new List<PersonModel>();
                foreach (dynamic item in list)
                {
                    var person = Mapper.DynamicMap<PersonModel>(item.Person);
                    person.ResidentID = item.ResidentID;
                    person.ResidentType = item.ResidentType;
                    newList.Add(person);
                }
                response.Data = newList;
            };

            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                mapperResponse(list);
            }
            else
            {
                var list = q.ToList();
                mapperResponse(list);
            }

            return response;
        }

        public BaseResponse<PersonModel> GetPerson(int personID)
        {
            return base.Get<DC_Person, PersonModel>((q) => q.PersonID == personID);
        }

        public BaseResponse<PersonModel> SavePerson(PersonModel request)
        {
            var responese = new BaseResponse<PersonModel>();
            try
            {
                request.Pinyin = Util.MkPinyinString(request.Name);
                responese = base.Save<DC_Person, PersonModel>(request, (q) => q.PersonID == request.PersonID);
                if (responese.IsSuccess)
                {
                    var resident = unitOfWork.GetRepository<DC_Resident>().dbSet.FirstOrDefault(a => a.PersonID == request.PersonID);

                    if (resident == null)
                    {
                        resident = new DC_Resident();
                        resident.OrganizationID = request.OrganizationID;
                        resident.PersonID = request.PersonID;
                        resident.ResidentNo = GenerateCode(EnumCodeKey.ResidentCode, EnumCodeRule.Year, "R", 4, request.OrganizationID);
                        resident.CheckInDate = DateTime.Now;
                        resident.ResidentType = Enum.GetName(typeof(ResidentType), ResidentType.Unsigned);
                        resident.Status = "I";
                        resident.CreatedTime = DateTime.Now;

                        var idCard = responese.Data.IdCard;
                        if (!string.IsNullOrEmpty(idCard) && idCard.Length>6)
                        {
                            resident.Password = Util.Md5(idCard.Substring(idCard.Length - 6) + idCard);
                        }
                        resident.CreatedBy = 0;
                        resident.CreatedTime = DateTime.Now;
                        bool rs = unitOfWork.GetRepository<DC_Resident>().Insert(resident);
                        unitOfWork.Save();
                    }

                    resident = unitOfWork.GetRepository<DC_Resident>().dbSet.FirstOrDefault(a => a.PersonID == request.PersonID);
                    if (resident!=null)
                    {
                        var str = "{ \"ResidentID\":" + resident.ResidentID + ",\"Name\":\"" + responese.Data.Name + "\",\"IdCard\":\"" + responese.Data.IdCard + "\",\"Sex\":" + responese.Data.Sex + "}";
                        var qrPath = HttpContext.Current.Server.MapPath("~" + Constants.QrCodePath);
                        if (!Directory.Exists(qrPath))
                        {
                            Directory.CreateDirectory(qrPath);
                        }
                        var rs = Util.GetQRCode(str, qrPath + resident.ResidentID.ToString() + ".png");
                        if (rs)
                        {
                            responese.Data.QrPath = Constants.QrCodePath + resident.ResidentID.ToString() + ".png";
                        }
                    }

                    responese.Data.ResidentID = resident.ResidentID;
                }

            }

            catch (Exception ex)
            {
                responese.IsSuccess = false;
                responese.ResultMessage = ex.Message;
            }

            return responese;
        }

        public BaseResponse DeletePerson(int personID)
        {
            var person = unitOfWork.GetRepository<DC_Person>().Get(personID);
            if (person!=null)
            {
                person.IsDeleted = true;
                person.ModifiedBy = 0;
                person.ModifiedTime = DateTime.Now;
                unitOfWork.GetRepository<DC_Person>().Update(person);

                var resident = unitOfWork.GetRepository<DC_Resident>().dbSet.Where(a => a.PersonID == personID).FirstOrDefault();
                if (resident!=null)
                {
                    resident.IsDeleted = true;
                    resident.ModifiedBy = 0;
                    resident.ModifiedTime = DateTime.Now;
                    unitOfWork.GetRepository<DC_Resident>().Update(resident);
                }
                unitOfWork.Save();
            }
            return new BaseResponse() ;
        }

        public bool IsExistCard(string cardId,int orgId,int? personId)
        {
            var obj =base.Get<DC_Person, PersonModel>((q) => q.IdCard == cardId && !q.IsDeleted && q.OrganizationID == orgId && (personId.HasValue?q.PersonID!=personId:true));
            return obj.Data != null;
        }

        #endregion
    }
}
