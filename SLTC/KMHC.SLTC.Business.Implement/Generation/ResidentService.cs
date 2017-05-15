namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KM.Common;
    using KMHC.Infrastructure;
    using KMHC.Infrastructure.Security;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using Newtonsoft.Json;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.IO;
    using System.Linq;
    using System.Web;

    public partial class ResidentService : BaseService, IResidentService
    {
        #region DC_Resident
        public BaseResponse<IList<ResidentModel>> QueryResident(BaseRequest<ResidentFilter> request)
        {
            var response = new BaseResponse<IList<ResidentModel>>();
            var dicRepository = from a in unitOfWork.GetRepository<SYS_Dictionary>().dbSet.Where(a => a.ItemType == "K00.016")
                                join b in unitOfWork.GetRepository<SYS_DictionaryItem>().dbSet on a.DictionaryID equals b.DictionaryID
                                select b;

            var q = from r in unitOfWork.GetRepository<DC_Resident>().dbSet
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a=>!a.IsDeleted) on r.PersonID equals p.PersonID
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
                        OrgName = b.OrgName,
                        Pinyin = p.Pinyin
                    };

            if (request != null)
            {
                if (request.Data.ResidentId.HasValue && request.Data.ResidentId != 0)
                {
                    q = q.Where(m => m.r.ResidentID == request.Data.ResidentId);
                }

                if (request.Data.ResidentIDs != null && request.Data.ResidentIDs.Length > 0)
                {
                    q = q.Where(m => request.Data.ResidentIDs.Contains(m.r.ResidentID));
                }
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.r.OrganizationID == request.Data.OrganizationID);
                }
                if (request.Data.PersonId.HasValue && request.Data.PersonId != 0)
                {
                    q = q.Where(m => m.r.PersonID == request.Data.PersonId);
                }
                if (!string.IsNullOrEmpty(request.Data.PersonName))
                {
                    q = q.Where(m => m.PersonName.Contains(request.Data.PersonName.Trim()));
                }
                if (!string.IsNullOrEmpty(request.Data.Sex))
                {
                    q = q.Where(m => m.Sex == request.Data.Sex.Trim());
                }
                if (request.Data.HasLocation)
                {
                    q = q.Where(m => m.Lng.HasValue && m.Lat.HasValue);
                }

                if (!string.IsNullOrEmpty(request.Data.Keywords))
                {
                    q = q.Where(m => m.PersonName.ToUpper().Contains(request.Data.Keywords.ToUpper()) || m.IdCard.Contains(request.Data.Keywords) || m.Pinyin.Contains(request.Data.Keywords.ToUpper()));
                }

            }
            q = q.Where(w => w.r.IsDeleted == false && w.r.Status == "I");//状态为有效
            q = q.OrderByDescending(m => m.r.ResidentID);
            response.RecordsCount = q.Count();
            Action<IList> mapperResponse = (IList list) =>
            {
                response.Data = new List<ResidentModel>();
                foreach (dynamic item in list)
                {
                    ResidentModel resident = Mapper.DynamicMap<ResidentModel>(item.r);
                    resident.PersonName = item.PersonName;
                    resident.Sex = item.Sex;
                    resident.Nationality = item.Nationality;
                    resident.NationalityName = item.NationalityName;
                    resident.CensusAddressName = item.CensusAddressName;
                    resident.PhotoPath = item.PhotoPath;
                    resident.Birthdate = item.Birthdate;
                    resident.IdCard = item.IdCard;
                    resident.PersonNo = item.PersonNo;
                    resident.City = item.City;
                    resident.Address = item.Address;
                    resident.HouseNumber = item.HouseNumber;
                    resident.Phone = item.Phone;
                    resident.AreaID = item.AreaID;
                    resident.AreaName = item.AreaName;
                    resident.Lng = item.Lng;
                    resident.Lat = item.Lat;
                    resident.OrgName = item.OrgName;
                    response.Data.Add(resident);
                }
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

        public BaseResponse<ResidentModel> GetResident(int residentID)
        {
            var response = new BaseResponse<ResidentModel>();
            var request = new BaseRequest<ResidentFilter>()
            {
                Data = { ResidentId = residentID }
            };
            var residentList = QueryResident(request);
            if (residentList.RecordsCount > 0)
            {
                response.Data = residentList.Data[0];
            }
            return response;
        }
        public BaseResponse<IList<ResidentModel>> QueryResidentByOrganizationID(int OrganizationID)
        {
           
            var request = new BaseRequest<ResidentFilter>()
            {
                Data = { OrganizationID = OrganizationID }
            };
            var residentList = QueryResident(request);

            return residentList;
        }
        public BaseResponse<ResidentModel> GetResidentByResidentID(int residentID, int OrganizationID)
        {
            //return base.Get<DC_Resident, ResidentModel>((q) => q.ResidentID == residentID);
            BaseResponse<ResidentModel> Response = new BaseResponse<ResidentModel>();
            var request = new BaseRequest<ResidentFilter>()
            {
                Data = { ResidentId = residentID, 
                OrganizationID=OrganizationID}
            };
            var residentList = QueryResident(request);
            Response.Data = residentList.Data.FirstOrDefault();

            if (Response.Data!=null)
            {
                var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
                var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == residentID);
                if (deposit!=null)
                {
                    Response.Data.RemainingMoney = deposit.Amount - deposit.TotalConSpeMonth;
                }
                Response.Data.QrPath = Constants.QrCodePath + Response.Data.ResidentID.ToString() + ".png";
            }

            return Response;
        }
        public BaseResponse<ResidentModel> SaveResident(ResidentModel request)
        {
            var residentRepository = base.unitOfWork.GetRepository<DC_Resident>();
            var personRepository = base.unitOfWork.GetRepository<DC_Person>();
            //var per = personRepository.dbSet.FirstOrDefault(f => f.PersonID == request.PersonID && f.IsDeleted == false && f.AuditState == "A");
            var per = personRepository.dbSet.FirstOrDefault(f => f.PersonID == request.PersonID && f.IsDeleted == false);
            if (per == null)
            {
                return new BaseResponse<ResidentModel>() { IsSuccess = false, ResultMessage = string.Format("档案ID:{0} 无效！", request.PersonID) };
            }
            else if (per.AuditState == "U" && request.ResidentType == Enum.GetName(typeof(ResidentType), ResidentType.Signed))
            {
                return new BaseResponse<ResidentModel>() { IsSuccess = false, ResultMessage = "该档案尚未认证，无法设置为签约会员！" };
            }

            var ps = residentRepository.dbSet.FirstOrDefault(f => f.PersonID == request.PersonID && f.OrganizationID == request.OrganizationID && f.Status == "I" && request.IsDeleted == false);
            if (ps != null)
            {
                ps.AreaID = request.AreaID;
                ps.ResidentType = request.ResidentType;
                residentRepository.Update(ps);
            }
            else
            {
                request.ResidentNo = GenerateCode(EnumCodeKey.ResidentCode, EnumCodeRule.Year, "R", 4, request.OrganizationID);
                request.CheckInDate = DateTime.Now;
                request.Status = "I";
                request.CreatedTime = DateTime.Now;
                var resident = Mapper.DynamicMap<DC_Resident>(request);
                var idCard = per.IdCard;
                var initPassword = idCard.Substring(idCard.Length - 6) + idCard;
                resident.Password = Util.Md5(initPassword);
                residentRepository.Insert(resident);
            }

            if (request.Lat.HasValue && request.Lng.HasValue) {
                per.Lng = request.Lng.Value;
                per.Lat = request.Lat.Value;
                personRepository.Update(per);
            }

            unitOfWork.Save();


            var person = residentRepository.dbSet.FirstOrDefault(f => f.PersonID == request.PersonID && f.OrganizationID == request.OrganizationID && f.Status == "I" && request.IsDeleted == false);

            if (person!=null)
            {
                var str = "{ \"ResidentID\":" + person.ResidentID + ",\"Name\":\"" + per.Name + "\",\"IdCard\":\"" + per.IdCard + "\",\"Sex\":" + per.Sex + "}";
                var qrPath = HttpContext.Current.Server.MapPath("~" + Constants.QrCodePath);
                if (!Directory.Exists(qrPath))
                {
                    Directory.CreateDirectory(qrPath);
                }
                Util.GetQRCode(str, qrPath + person.ResidentID.ToString() + ".png");
            }
            return new BaseResponse<ResidentModel>() { IsSuccess = true, Data = request };
        }

        public BaseResponse DeleteResident(int residentID)
        {
            return base.Delete<DC_Resident>(residentID);
        }

        public bool Login(string name, string pwd, out ClientResidentData user)
        {
            user = null;
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(pwd))
            {
                return false;
            }
            var m = from r in unitOfWork.GetRepository<DC_Resident>().dbSet.Where(q => q.IsDeleted == false && q.Password == pwd)
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(q=>q.IdCard==name && !q.IsDeleted) on r.PersonID equals p.PersonID
                    join q in unitOfWork.GetRepository<ORG_Organization>().dbSet on r.OrganizationID equals q.OrganizationID
                    select new ClientResidentData
                    {
                        ResidentID= r.ResidentID,
                        ResidentNo = r.ResidentNo,
                        LoginName = p.IdCard,
                        ResidentName = p.Name,
                        OrgId = r.OrganizationID,
                        PersonID = r.PersonID,
                        AreaID = r.AreaID,
                        OrgAddress = q.City+q.Address,
                        OrgPhone = q.Tel
                    };
            user = m.FirstOrDefault();
            if (user == null) return false;
            return true;
        }

        public BaseResponse<string> ChangePassword(string id, string newPassword, string oldPassword)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var m = from r in unitOfWork.GetRepository<DC_Resident>().dbSet
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(q => q.IdCard == id && !q.IsDeleted) on r.PersonID equals p.PersonID
                    select r;
            var model = m.FirstOrDefault();
            if (model != null)
            {
                if (model.Password == Util.Md5(oldPassword + id))
                {
                    model.Password = Util.Md5(newPassword + id);
                    model.ModifiedTime = DateTime.Now;
                    unitOfWork.GetRepository<DC_Resident>().Update(model);
                    unitOfWork.Save();
                    response.ResultMessage = "修改成功";
                    response.IsSuccess = true;
                }
                else
                {
                    response.ResultCode = -1;
                    response.IsSuccess = false;
                    response.ResultMessage = "旧密码输入错误";
                }

            }
            else
            {
                response.ResultCode = -1;
                response.IsSuccess = false;
                response.ResultMessage = "用户信息找不到";
            }
            return response;
        }

        public BaseResponse GenAllQrCode()
        {
            var m = from r in unitOfWork.GetRepository<DC_Resident>().dbSet
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet on r.PersonID equals p.PersonID
                    select new
                    {
                        ResidentID = r.ResidentID,
                        Name = p.Name,
                        IdCard = p.IdCard,
                        Sex = p.Sex
                    };
            var list = m.ToList();
            var qrPath = HttpContext.Current.Server.MapPath("~" + Constants.QrCodePath);
            if (!Directory.Exists(qrPath))
            {
                Directory.CreateDirectory(qrPath);
            }
            var str = "";
            list.ForEach(a => {
                str = "{ \"ResidentID\":" + a.ResidentID + ",\"Name\":\"" + a.Name + "\",\"IdCard\":\"" + a.IdCard + "\",\"Sex\":" + a.Sex + "}";
                Util.GetQRCode(str, qrPath + a.ResidentID.ToString() + ".png");
            });

            return new BaseResponse();
        }

        public BaseResponse SaveSOSData(SOSFileter sos)
        {
            var watchFlag = Enum.GetName(typeof(DeviceType), DeviceType.Watch);
            var sosdata = JsonConvert.DeserializeObject<SOSDataModel>(sos.data);
            BaseResponse res = new BaseResponse();
            var m = from r in unitOfWork.GetRepository<DC_Resident>().dbSet
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet on r.PersonID equals p.PersonID
                    join q in unitOfWork.GetRepository<DC_Device>().dbSet.Where(a => a.DeviceType == watchFlag) on p.PersonID equals q.PersonID 
                    where q.DeviceNo == sosdata.IMEI
                    select r;

            if (!m.Any())
            {
                return res;
            }
            try
            {
                var sosRepository =  unitOfWork.GetRepository<DC_SOSData>();
                var saveModel = sosRepository.dbSet.Where(it => it.IMEI == sosdata.IMEI).FirstOrDefault();
                if (saveModel==null)
                {
                    saveModel = Mapper.DynamicMap<DC_SOSData>(sosdata);
                    sosRepository.Insert(saveModel);
                }
                else
                {
                    saveModel.EmgDate = sosdata.EmgDate;
                    saveModel.Address = sosdata.Address;
                    saveModel.Lng = sosdata.Lng;
                    saveModel.Lat = sosdata.Lat;
                    saveModel.Hpe = sosdata.Hpe;
                    saveModel.Method = sosdata.Method;
                    sosRepository.Update(saveModel);
                }

                unitOfWork.Save();
            }catch(Exception ex){
                res.IsSuccess = false;
                res.ResultMessage = "已接收，但是未保存成功。";
            }

            return res;
        }

        public BaseResponse<List<SOSDataModel>> GetSOSData(int orgId, string name = "")
        {
            var exp = (DateTime.Today.ToUniversalTime() - new DateTime(1970, 1, 1, 0, 0, 0, DateTimeKind.Utc)).TotalMilliseconds;

            var watchFlag = Enum.GetName(typeof(DeviceType), DeviceType.Watch);
            BaseResponse<List<SOSDataModel>> res = new BaseResponse<List<SOSDataModel>>();
            var m = from r in unitOfWork.GetRepository<DC_Resident>().dbSet.Where(a => a.OrganizationID == orgId)
                    join p in unitOfWork.GetRepository<DC_Person>().dbSet.Where(a => !a.IsDeleted &&(a.Name == null || name == null|| a.Name.Contains(name)))
                        on r.PersonID equals p.PersonID
                    join h in unitOfWork.GetRepository<DC_Device>().dbSet.Where(a => a.DeviceType == watchFlag) on p.PersonID equals h.PersonID 
                    join q in unitOfWork.GetRepository<DC_SOSData>().dbSet on h.DeviceNo equals q.IMEI
                    where q.EmgDate >= exp
                    select new SOSDataModel
                    {
                        ID = q.ID,
                        IMEI = q.IMEI,
                        Address = q.Address,
                        EmgDate = q.EmgDate.Value,
                        Name = p.Name,
                        Lng = q.Lng.Value,
                        Lat = q.Lat.Value,
                        Hpe = q.Hpe.Value,
                        Method = q.Method,
                        Phone = p.Phone
                    }
                    ;

            res.Data = m.ToList();
            return res;
        }

        public BaseResponse<ResidentInfoModel> GetResidentInfo(int residentID,int personID)
        {
            var response = new BaseResponse<ResidentInfoModel>();
            response.Data = new ResidentInfoModel();
            var depositRepository = unitOfWork.GetRepository<DC_Deposit>();
            var callRepository = unitOfWork.GetRepository<DC_CallInfo>();
            var orderRepository = unitOfWork.GetRepository<DC_ServiceOrder>();
            var deposit = depositRepository.dbSet.FirstOrDefault(it => it.ResidentID == residentID);
            if (deposit != null)
            {
                response.Data.Amount = deposit.Amount;
                response.Data.TotalConSpeMonth = deposit.TotalConSpeMonth;
            }

            response.Data.CallNum = callRepository.dbSet.Where(a => a.PersonID == personID).Count();
            response.Data.OrderNumber = orderRepository.dbSet.Where(a => a.ResidentID == residentID && !a.IsDeleted).Count();
            response.Data.ServiceAmount = orderRepository.dbSet.Where(a => a.ResidentID == residentID && !a.IsDeleted).Sum(a=>a.Price);
            return response;
        }
        #endregion
    }
}
