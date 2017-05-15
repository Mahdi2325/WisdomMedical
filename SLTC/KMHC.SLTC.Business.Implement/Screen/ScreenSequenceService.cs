using AutoMapper;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.Business.Interface.Sequence;
using KMHC.SLTC.Persistence;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Implement.Screen
{
    public class ScreenSequenceService : BaseService, IScreenSequenceService
    {
      /// <summary>
      /// 获取大屏幕展示数据
      /// </summary>
      /// <param name="deptid">科室ID</param>
      /// <param name="start">开始查询位置 从0开始  0代表查询索引值后所有记录  没有从3查到8的情况</param>
        /// <param name="leng">-1 代表查询跳过N行后的所有行</param>
      /// <returns></returns>
        public BaseResponse<IList<ScreenDisplayModel>> QueryScreenList(int deptid = 0, int start = 0, int leng = -1)
        {
            BaseResponse<IList<ScreenDisplayModel>> response = new BaseResponse<IList<ScreenDisplayModel>>();
            //
            var ServiceItem = base.unitOfWork.GetRepository<DC_ServiceItem>().dbSet;
            var CheckRoomQueue = base.unitOfWork.GetRepository<DC_CheckRoomQueue>().dbSet;
            var Dept = base.unitOfWork.GetRepository<ORG_Dept>().dbSet;
            var DC_CheckRoomQueueRec = base.unitOfWork.GetRepository<DC_CheckRoomQueueRec>().dbSet;

            //ResidentName 顾客姓名   SerialNumber 当天序号即：语音播报号   deptName：科室名称    deptId：科室ID    CheckStatus：当前状态    ServiceOrderID：订单号   CheckNumber：实际检查序号
            var query = from CQ in CheckRoomQueue
                        join SI in ServiceItem
                        on CQ.ServiceItemID equals SI.ServiceItemID
                        join DP in Dept
                        on SI.DeptId equals DP.DeptID
                        join DCR in DC_CheckRoomQueueRec
                        on CQ.CheckRoomQueueRecID equals DCR.CheckRoomQueueRecID
                        orderby CQ.CheckNumber
                        select new { CheckNumber = CQ.CheckNumber, ResidentName = CQ.ResidentName, SerialNumber = CQ.SerialNumber, deptName = DP.DeptName, deptId = DP.DeptID, CheckStatus = CQ.CheckStatus, ServiceOrderID = DCR.ServiceOrderID };//ResidentName = CQ.ResidentName, SerialNumber = CQ.SerialNumber, deptName = DP.DeptName, deptId = DP.DeptID, CheckStatus = CQ.CheckStatus, ServiceOrderID = DCR.ServiceOrderID

            var rs = query.GroupBy(a => new { a.deptId, a.deptName }).Select(a => new { a.Key.deptId, a.Key.deptName, InfoList = a });

            if (deptid != 0)//根据deptid查询
            {
                rs = rs.Where(A => A.deptId == deptid);//
                var data = rs.ToList();
                if (rs.Count() > 0)
                {
                    List<ScreenDisplayModel> AllList = Mapper.DynamicMap<List<ScreenDisplayModel>>(data);
                    AllList[0].InfoList = AllList[0].InfoList.OrderBy(A => A.CheckNumber).ToList();
                    if (start == 0 && leng > 0)//查询前几行
                    {
                        AllList[0].InfoList = AllList[0].InfoList.Take(leng).ToList();
                    }
                    if (start != 0 && leng == -1)//查询从第几行后的所有数据
                    {
                        int record = AllList[0].InfoList.Count - start;
                        AllList[0].InfoList = AllList[0].InfoList.Skip(start).Take(record).ToList();
                    }
                    response.Data = AllList;
                    response.RecordsCount = AllList[0].InfoList.Count;
                }
                if (response.RecordsCount > 0)
                {
                    return response;
                }
                else
                {
                    return null;
                }
            }
            else
            {
                var data = rs.ToList();
                int groupNum = rs.Count();//分成了几组
                if (rs.Count() > 0)
                {
                    List<ScreenDisplayModel> AllList = Mapper.DynamicMap<List<ScreenDisplayModel>>(data);
                    for (int i = 0; i < groupNum; i++)
                    {
                        AllList[i].InfoList = AllList[i].InfoList.OrderBy(A => A.CheckNumber).ToList();
                    }
                    if (start == 0 && leng > 0)//查询前几行
                    {
                        for (int i = 0; i < groupNum; i++)
                        {
                            AllList[i].InfoList = AllList[i].InfoList.Take(leng).ToList();
                        }
                    }
                    if (start != 0 && leng == -1)//查询从第几行后的所有数据
                    {
                        for (int i = 0; i < groupNum; i++)
                        {
                            int record = AllList[i].InfoList.Count - start;
                            AllList[i].InfoList = AllList[i].InfoList.Skip(start).Take(record).ToList();
                        }
                        
                    }
                    response.Data = AllList;
                    int RecordsCount = 0;
                    for (int i = 0; i < groupNum; i++)
                    {
                        RecordsCount += AllList[i].InfoList.Count;
                    }
                    response.RecordsCount = RecordsCount;
                }
                if (response.RecordsCount > 0)
                {
                    return response;
                }
                else
                {
                    return null;
                }
            }
          
            
        }

        /// <summary>
        /// 查询Org
        /// </summary>
        /// <returns></returns>
        public BaseResponse<IList<OrganizationModel>> QueryOrg()
        {
            BaseResponse<IList<OrganizationModel>> response = new BaseResponse<IList<OrganizationModel>>();
            var Org = base.unitOfWork.GetRepository<ORG_Organization>().dbSet;
            var query = from CQ in Org
                        orderby CQ.GroupID
                        select new OrganizationModel { OrganizationID = CQ.OrganizationID, GroupID = CQ.GroupID, OrgNo = CQ.OrgNo, OrgName = CQ.OrgName, OrgType = CQ.OrgType, Contact = CQ.Contact, Tel = CQ.Tel, Fax = CQ.Fax, Email = CQ.Email, WebSite = CQ.WebSite, City = CQ.City, Address = CQ.Address, HouseNumber = CQ.HouseNumber, Lng = CQ.Lng, Lat = CQ.Lat, LogoPath = CQ.LogoPath, CreatedBy = CQ.CreatedBy, CreatedTime = CQ.CreatedTime, ModifiedBy = CQ.ModifiedBy, ModifiedTime = CQ.ModifiedTime, IsDeleted = CQ.IsDeleted };
            var data = query.ToList();
            response.RecordsCount = query.Count();
            response.Data = data;
            return response;
        }
    }

   
}
