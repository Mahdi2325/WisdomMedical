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
    using KMHC.SLTC.Repository.Base;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Globalization;
    using System.IO;
    using System.Linq;
    using System.Linq.Expressions;
    using System.Web;

    public partial class ActivityService : BaseService, IActivityService
    {
        #region DC_ResidentAddress
        public BaseResponse<IList<ActivityModel>> QueryActivity(BaseRequest<GroupActivityRecordFilter> request)
        {
            BaseResponse<IList<ActivityModel>> response = new BaseResponse<IList<ActivityModel>>();
            var q = from ac in unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet
                    join gac in unitOfWork.GetRepository<DC_GroupActivityCategory>().dbSet on ac.CategoryID equals gac.ID
                    join gai in unitOfWork.GetRepository<DC_GroupActivityItem>().dbSet on ac.ItemID equals gai.ID
                        into gaiTemp
                    from gaiItem in gaiTemp.DefaultIfEmpty()
                    join ar in unitOfWork.GetRepository<ORG_Area>().dbSet on ac.AreaID equals ar.AreaID into Area
                    from areaTem in Area.DefaultIfEmpty()
                    select new ActivityModel { 
                        ID = ac.ID,
                        CategoryID = ac.CategoryID.Value,
                        CategoryName = gac.CategoryName,
                        ItemID = ac.ItemID.Value,
                        ItemName = gaiItem.ItemName,
                        ActivityName = ac.ActivityName,
                        ActivityContent = ac.ActivityContent,
                        ActivityPlace = ac.ActivityPlace,
                        StartTime = ac.StartTime.Value,
                        Hours = ac.Hours.Value,
                        EndTime = ac.EndTime.Value,
                        EmployeeIDs = ac.EmployeeIDs,
                        EmployeeNames = ac.EmployeeNames,
                        EmployeeCount = ac.EmployeeCount.Value,
                        MemberIDs = ac.MemberIDs,
                        MemberNames = ac.MemberNames,
                        MemberCount = ac.MemberCount.Value,
                        OtherPersons = ac.OtherPersons,
                        OtherCount = ac.OtherCount.Value,
                        AreaID = ac.AreaID.Value,
                        AreaName = ac.AreaID == null ? "" : (ac.AreaID==-1?"其他区域":areaTem.AreaName),
                        CreateFromID = ac.CreateFromID.Value,
                        OrganizationID = ac.OrganizationID.Value                        
                    };
            if (request != null)
            {
                if (request.Data.OrganizationID != 0)
                {
                    q = q.Where(m => m.OrganizationID == request.Data.OrganizationID);
                }

                if (!string.IsNullOrEmpty(request.Data.Keywords))
                {
                    q = q.Where(m => m.ActivityName.Contains(request.Data.Keywords) || m.ActivityContent.Contains(request.Data.Keywords));
                }

                if (request.Data.CategoryID != null && request.Data.CategoryID.HasValue)
                {
                    q = q.Where(m => m.CategoryID == request.Data.CategoryID);
                }
                if (request.Data.ItemID != null && request.Data.ItemID.HasValue)
                {
                    q = q.Where(m => m.ItemID == request.Data.ItemID);
                }
                if (request.Data.AreaID != null && request.Data.AreaID.HasValue)
                {
                    q = q.Where(m => m.AreaID == request.Data.AreaID);
                }
            }
            q = q.OrderByDescending(m => m.StartTime);
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
        public BaseResponse GetActivitiesForDate(string date,int organizationID)
        {

            BaseResponse<IList<ActivityModel>> response = new BaseResponse<IList<ActivityModel>>();

            DateTime startDate;
            DateTime startDateEnd;
            if (!string.IsNullOrEmpty(date)) { 
                 DateTimeFormatInfo dtFormat = new System.Globalization.DateTimeFormatInfo();
                dtFormat.ShortDatePattern = "yyyy/MM/dd";
                startDate = Convert.ToDateTime(date, dtFormat);
                startDateEnd = startDate.AddDays(1);
            }
            else{
                response.IsSuccess = false;
                response.ResultMessage = "时间为空";
                return response;
            }

            try{

                var q = from ac in unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet.Where(m => m.StartTime >= startDate && m.StartTime <= startDateEnd && m.OrganizationID == organizationID)
                        select new ActivityModel
                        {
                            ID = ac.ID,
                            CategoryID = ac.CategoryID.Value,
                            ItemID = ac.ItemID.Value,
                            ActivityName = ac.ActivityName,
                            ActivityContent = ac.ActivityContent,
                            ActivityPlace = ac.ActivityPlace,
                            StartTime = ac.StartTime.Value,
                            Hours = ac.Hours.Value,
                            EndTime = ac.EndTime.Value,
                            EmployeeIDs = ac.EmployeeIDs,
                            EmployeeNames = ac.EmployeeNames,
                            EmployeeCount = ac.EmployeeCount.Value,
                            MemberIDs = ac.MemberIDs,
                            MemberNames = ac.MemberNames,
                            MemberCount = ac.MemberCount.Value,
                            OtherPersons = ac.OtherPersons,
                            OtherCount = ac.OtherCount.Value,
                            CreateFromID = ac.CreateFromID.Value,
                            OrganizationID = ac.OrganizationID.Value
                        };

                response.Data = q.ToList();
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ResultMessage = ex.Message;
            }
            return response;

        }
        public BaseResponse<ActivityModel> GetActivity(int id)
        {

            BaseResponse<ActivityModel> respone = base.Get<DC_GroupActivityRecord, ActivityModel>((q) => q.ID == id);


            var splitChar =  new Char[] { ',' } ;

            if (!string.IsNullOrEmpty(respone.Data.EmployeeIDs))
            {
                int[] employeeIds = ToIntArray(respone.Data.EmployeeIDs.Split(splitChar));
                var p = unitOfWork.GetRepository<ORG_Employee>().dbSet.Where(a => employeeIds.Any(c => c == a.EmployeeID));

                ArrayQueryModel<int>[] empObjectIds = ToObjectArray(respone.Data.EmployeeIDs.Split(splitChar));
                var j = from a in p.ToList()
                        join b in empObjectIds on a.EmployeeID equals b.ID
                        orderby b.Order
                        select a;

                respone.Data.EmployeeIDs = string.Join(",", j.Select(t => t.EmployeeID).ToArray());
                respone.Data.EmployeeNames = string.Join(",", j.Select(t => t.EmpName).ToArray());
            }

            if (!string.IsNullOrEmpty(respone.Data.MemberIDs))
            {
                int[] memberIds = ToIntArray(respone.Data.MemberIDs.Split(splitChar));

                var m = from rt in unitOfWork.GetRepository<DC_Resident>().dbSet.Where(a => memberIds.Any(c => c == a.ResidentID))
                        join ps in unitOfWork.GetRepository<DC_Person>().dbSet on rt.PersonID equals ps.PersonID
                        select new
                        {
                            MemberID = rt.ResidentID,
                            MemberName = ps.Name
                        };

                ArrayQueryModel<int>[] memberObjectIds = ToObjectArray(respone.Data.MemberIDs.Split(splitChar));

                var k = from a in m.ToList()
                        join b in memberObjectIds on a.MemberID equals b.ID
                        orderby b.Order
                        select a;

                respone.Data.MemberIDs = string.Join(",", k.Select(t => t.MemberID).ToArray());
                respone.Data.MemberNames = string.Join(",", k.Select(t => t.MemberName).ToArray());
            }

            return respone;
        }
        

        /// <summary>
        /// 字符串数组转换整形数组
        /// </summary>
        /// <param name="Content">字符串数组</param>
        /// <returns></returns>
        private static int[] ToIntArray(string[] Content)
        {
            int[] c = new int[Content.Length];
            for (int i = 0; i < Content.Length; i++)
            {
                c[i] = Convert.ToInt32(Content[i].ToString());
            }
            return c;
        }

        /// <summary>
        /// 字符串数组转换整形数组
        /// </summary>
        /// <param name="Content">字符串数组</param>
        /// <returns></returns>
        private static ArrayQueryModel<int>[] ToObjectArray(string[] Content)
        {
            ArrayQueryModel<int>[] c = new ArrayQueryModel<int>[Content.Length];
            for (int i = 0; i < Content.Length; i++)
            {
                ArrayQueryModel<int> md = new ArrayQueryModel<int>();
                md.ID = Convert.ToInt32(Content[i].ToString());
                md.Order = i;
                c[i] = md;
            }
            return c;
        }

        public BaseResponse<ActivityModel> SaveActivity(ActivityModel request)
        {
            BaseResponse<ActivityModel> response = new BaseResponse<ActivityModel>();

            try
            {
                response = base.Save<DC_GroupActivityRecord, ActivityModel>(request, (q) => q.ID == request.ID);

                if (response.IsSuccess)
                {
                    var qrPath = HttpContext.Current.Server.MapPath("~/uploads/ActivityQR/");
                    if (!Directory.Exists(qrPath))
                    {
                        Directory.CreateDirectory(qrPath);
                    }

                    var str = "{ \"ActivityID\":" + response.Data.ID + ",\"CreateFromID\":" + response.Data.CreateFromID + ",\"ActivityName\":\"" + response.Data.ActivityName + "\",\"ActivityPlace\":\"" + response.Data.ActivityPlace + "\"}";
                    Util.GetQRCode(str, qrPath + response.Data.ID.ToString() + ".png");
                }
            }catch(Exception ex){
                response.IsSuccess = false;
                response.ResultMessage = ex.Message;
            }

            return response;
        }



        public BaseResponse GetDatesForMonth(string date, int organizationID)
        {
            BaseResponse<IList<DateTime>> response = new BaseResponse<IList<DateTime>>();
            DateTime startDate;
            DateTime startDateEnd;
            if (!string.IsNullOrEmpty(date))
            {
               
                DateTimeFormatInfo dtFormat = new System.Globalization.DateTimeFormatInfo();
                dtFormat.ShortDatePattern = "yyyy/MM/dd";
                
                startDate = Convert.ToDateTime(date, dtFormat);
                startDateEnd = startDate.AddMonths(1);
            }
            else
            {
                response.IsSuccess = false;
                response.ResultMessage = "时间为空";
                return response;
            }

            try
            {

                var q = from ac in unitOfWork.GetRepository<DC_GroupActivityRecord>().dbSet.Where(m => m.StartTime >= startDate && m.StartTime <= startDateEnd && m.OrganizationID == organizationID)
                        select new ActivityModel
                        {
                            ID = ac.ID,
                            CategoryID = ac.CategoryID.Value,
                            ItemID = ac.ItemID.Value,
                            ActivityName = ac.ActivityName,
                            ActivityContent = ac.ActivityContent,
                            ActivityPlace = ac.ActivityPlace,
                            StartTime = ac.StartTime.Value,
                            Hours = ac.Hours.Value,
                            EndTime = ac.EndTime.Value,
                            EmployeeIDs = ac.EmployeeIDs,
                            EmployeeNames = ac.EmployeeNames,
                            EmployeeCount = ac.EmployeeCount.Value,
                            MemberIDs = ac.MemberIDs,
                            MemberNames = ac.MemberNames,
                            MemberCount = ac.MemberCount.Value,
                            OtherPersons = ac.OtherPersons,
                            OtherCount = ac.OtherCount.Value,
                            CreateFromID = ac.CreateFromID.Value,
                            OrganizationID = ac.OrganizationID.Value
                        };

                List<DateTime> datetimeLists = new List<DateTime>();

                foreach (ActivityModel ac in q.ToList()){
                    if(ac.StartTime != null)
                        datetimeLists.Add((DateTime)ac.StartTime);
                }
                response.Data = datetimeLists;
            }
            catch (Exception ex)
            {
                response.IsSuccess = false;
                response.ResultMessage = ex.Message;
            }
            return response;
        }

        public BaseResponse DeleteActivity(int id)
        {
            return base.Delete<DC_GroupActivityRecord>(id);
        }

        public BaseResponse SignActivity(ActivitySignFileter request)
        {

            BaseResponse response = new BaseResponse();
            var activityRepository = unitOfWork.GetRepository<DC_GroupActivityRecord>();
            var activityList = activityRepository.dbSet.Where(a => a.ID == request.ActivityID || a.CreateFromID == request.ActivityID).ToList();
            var activity = activityList.Where(a => DateTime.Today.CompareTo(a.StartTime.Value.Date) == 0).FirstOrDefault();

            unitOfWork.BeginTransaction();
            if (activity == null)
            {
                activity = activityList.Where(a => a.ID == request.ActivityID).FirstOrDefault();
                if (activity!=null)
                {
                    DC_GroupActivityRecord newActivity = new DC_GroupActivityRecord();
                    newActivity.CategoryID = activity.CategoryID;
                    newActivity.ItemID = activity.ItemID;
                    newActivity.ActivityName = activity.ActivityName;
                    newActivity.ActivityContent = activity.ActivityContent;
                    newActivity.ActivityPlace = activity.ActivityPlace;
                    newActivity.StartTime = DateTime.Now;
                    newActivity.AreaID = activity.AreaID;
                    newActivity.OrganizationID = activity.OrganizationID;
                    newActivity.CreateFromID = request.ActivityID;
                    activity = newActivity;
                }
                else
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "活动信息不存在，请联系管理员。";
                    return response;
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(activity.EmployeeIDs) && request.UserType == Enum.GetName(typeof(UserType), UserType.Employee)  && ("," + activity.EmployeeIDs + ",").IndexOf("," + request.UserID.ToString() + ",") != -1)
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "你已签到过，请勿重复签到。";
                    return response;
                }
                if (!string.IsNullOrEmpty(activity.MemberIDs) && request.UserType == Enum.GetName(typeof(UserType), UserType.Resident) && ("," + activity.MemberIDs + ",").IndexOf("," + request.UserID.ToString() + ",") != -1)
                {
                    response.IsSuccess = false;
                    response.ResultMessage = "你已签到过，请勿重复签到。";
                    return response;
                }
            }

            if (request.UserType == Enum.GetName(typeof(UserType), UserType.Employee))
            {
                if (!string.IsNullOrEmpty(activity.EmployeeIDs))
                {
                    activity.EmployeeIDs += "," + request.UserID;
                    activity.EmployeeNames += "," + request.UserName;
                    activity.EmployeeCount += 1;
                }
                else
                {
                    activity.EmployeeIDs = request.UserID.ToString(); ;
                    activity.EmployeeNames = request.UserName;
                    activity.EmployeeCount = 1;
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(activity.MemberIDs))
                {
                    activity.MemberIDs += "," + request.UserID;
                    activity.MemberNames += "," + request.UserName;
                    activity.MemberCount += 1;
                }
                else
                {
                    activity.MemberIDs = request.UserID.ToString(); ;
                    activity.MemberNames = request.UserName;
                    activity.MemberCount = 1;
                }
            }

            if (activity.ID==0)
            {
                activityRepository.Insert(activity);
            }
            else
            {
                activityRepository.Update(activity);
            }

            unitOfWork.Commit();
            return response;
        }
        #endregion
    }



    public class ArrayQueryModel<T>
    {
        public T ID { get; set; }
        public int Order { get; set; }
    }
}
