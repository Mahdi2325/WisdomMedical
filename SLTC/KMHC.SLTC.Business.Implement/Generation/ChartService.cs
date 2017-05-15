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
    public class ChartService : BaseService, IChartService
    {
        /// <summary>
        /// 获取某个集团下所有机构档案数
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartColumnModel> GetOrgDanAnList(int? groupId)
        {
            BaseResponse<ChartColumnModel> response = new BaseResponse<ChartColumnModel>();
            var query = from p in unitOfWork.GetRepository<DC_Person>().dbSet
                        join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                         on p.OrganizationID equals org.OrganizationID
                        where org.GroupID == groupId
                        group org by new { org.OrganizationID, org.OrgName } into g
                        select new
                        {
                            g.Key.OrganizationID,
                            g.Key.OrgName,
                            Count = g.Count()
                        };
            var list = query.ToList();
            if (list != null && list.Count != 0)
            {
                ChartColumnModel cm = new ChartColumnModel() { Name = new ArrayList(), Data = new ArrayList() };

                foreach (var item in list)
                {
                    cm.Name.Add(item.OrgName);
                    cm.Data.Add(item.Count);

                }
                response.Data = cm;
            }
            return response;
        }


        /// <summary>
        /// 获取某个集团下所有机构会员数
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartColumnModel> GetOrgHuiYuanList(int? groupId)
        {
            BaseResponse<ChartColumnModel> response = new BaseResponse<ChartColumnModel>();
            var query = from p in unitOfWork.GetRepository<DC_Resident>().dbSet
                        join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                         on p.OrganizationID equals org.OrganizationID
                        where org.GroupID == groupId
                        group org by new { org.OrganizationID, org.OrgName } into g
                        select new
                        {
                            g.Key.OrganizationID,
                            g.Key.OrgName,
                            Count = g.Count()
                        };
            var list = query.ToList();
            if (list != null && list.Count != 0)
            {
                ChartColumnModel cm = new ChartColumnModel() { Name = new ArrayList(), Data = new ArrayList() };

                foreach (var item in list)
                {
                    cm.Name.Add(item.OrgName);
                    cm.Data.Add(item.Count);

                }
                response.Data = cm;
            }
            return response;
        }

        /// <summary>
        /// 获取某个集团下机构服务订单量统计
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartColumnModel> GetOrgOrderList(int? groupId)
        {
            BaseResponse<ChartColumnModel> response = new BaseResponse<ChartColumnModel>();
            var query = from p in unitOfWork.GetRepository<DC_Resident>().dbSet
                        join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                         on p.OrganizationID equals org.OrganizationID
                        join SO in unitOfWork.GetRepository<DC_ServiceOrder>().dbSet
                        on p.ResidentID equals SO.ResidentID
                        where org.GroupID == groupId
                        group org by new { org.OrganizationID, org.OrgName } into g
                        select new
                        {
                            g.Key.OrganizationID,
                            g.Key.OrgName,
                            Count = g.Count()
                        };
            var list = query.ToList();
            if (list != null && list.Count != 0)
            {
                ChartColumnModel cm = new ChartColumnModel() { Name = new ArrayList(), Data = new ArrayList() };

                foreach (var item in list)
                {
                    cm.Name.Add(item.OrgName);
                    cm.Data.Add(item.Count);

                }
                response.Data = cm;
            }
            return response;
        }

        /// <summary>
        /// 获取某个集团下机构服务工单完成统计
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartMColumnModel> GetOrgTaskList(int? groupId)
        {
            BaseResponse<ChartMColumnModel> response = new BaseResponse<ChartMColumnModel>();
            //先找出有工单存在的机构
            var taskOrgquery = from t in unitOfWork.GetRepository<DC_Task>().dbSet
                               join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                                on t.OrganizationID equals org.OrganizationID
                               where org.GroupID == groupId
                               group org by new { org.OrganizationID, org.OrgName } into g
                               select new
                               {
                                   g.Key.OrganizationID,
                                   g.Key.OrgName
                               };
            var allorg = taskOrgquery.ToList();
            ChartMColumnModel cm = new ChartMColumnModel() { Name = new ArrayList(), AlreadyData = new ArrayList(), NoneData = new ArrayList() };
            //Wait, //没有分配
            //Assign, //已经分配
            //Execution, //正在执行
            //Finish //完成
            var dataorg = (from t in unitOfWork.GetRepository<DC_Task>().dbSet
                           join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                            on t.OrganizationID equals org.OrganizationID
                           where org.GroupID == groupId
                           select new
                           {
                               OrganizationID = org.OrganizationID,
                               OrgName = org.OrgName,
                               newSts = t.Status == "Wait" ? "NF" : t.Status == "Assign" ? "NF" : t.Status == "Execution" ? "NF" : "F"
                           }).GroupBy(a => new { a.newSts, a.OrganizationID, a.OrgName }).Select(b => new { b.Key.OrganizationID, b.Key.OrgName, b.Key.newSts, count = b.Count() }).ToList();
            Dictionary<string, int> data = new Dictionary<string, int>();
            foreach (var item in dataorg)
            {
                data.Add(item.OrganizationID + item.newSts, item.count);
            }

            foreach (var item in allorg)
            {
                cm.Name.Add(item.OrgName);
                if (data.ContainsKey(item.OrganizationID + "F"))
                {
                    cm.AlreadyData.Add(data[item.OrganizationID + "F"]);
                }
                else
                {
                    cm.AlreadyData.Add(0);
                }
                if (data.ContainsKey(item.OrganizationID + "NF"))
                {
                    cm.NoneData.Add(data[item.OrganizationID + "NF"]);
                }
                else
                {
                    cm.NoneData.Add(0);
                }

            }
            response.Data = cm;

            return response;
        }

        /// <summary>
        /// 获取所有机构下的男女比例
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartPieModel> GetOrgSexList(int? groupId)
        {
            BaseResponse<ChartPieModel> response = new BaseResponse<ChartPieModel>();


            //先找出有性别存在的机构
            var taskOrgquery = from t in unitOfWork.GetRepository<DC_Person>().dbSet
                               join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                                on t.OrganizationID equals org.OrganizationID
                               where org.GroupID == groupId
                               group org by new { org.OrganizationID, org.OrgName } into g
                               select new
                               {
                                   g.Key.OrganizationID,
                                   g.Key.OrgName
                               };
            var allorg = taskOrgquery.ToList();


            var query = from p in unitOfWork.GetRepository<DC_Person>().dbSet
                        join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                         on p.OrganizationID equals org.OrganizationID
                        where org.GroupID == groupId
                        group org by new { org.OrganizationID, org.OrgName, p.Sex } into g
                        select new
                        {
                            g.Key.OrganizationID,
                            g.Key.OrgName,
                            g.Key.Sex,
                            Count = g.Count()
                        };
            var list = query.ToList();

            Dictionary<string, string> dataName = new Dictionary<string, string>();
            Dictionary<string, int> dataValue = new Dictionary<string, int>();
            foreach (var item in query)
            {
                if (item.Sex == "1")
                {
                    dataName.Add(item.OrganizationID + "1", "男");
                    dataValue.Add(item.OrganizationID + "1", item.Count);
                }
                if (item.Sex == "2")
                {
                    dataName.Add(item.OrganizationID + "2", "女");
                    dataValue.Add(item.OrganizationID + "2", item.Count);
                }
                if (item.Sex != "1" && item.Sex != "2")
                {
                    dataName.Add(item.OrganizationID + "0", "其他");
                    dataValue.Add(item.OrganizationID + "0", item.Count);
                }

            }
            List<List<ArrayList>> baseList = new List<List<ArrayList>>() { };
            List<SelectModel> namelist = new List<SelectModel>();

            int index = 0;
            int nansum = 0;
            int nsum = 0;
            int qtsum = 0;
            foreach (var item in allorg)
            {
                index++;
                List<ArrayList> al = new List<ArrayList>();

                if (dataName.ContainsKey(item.OrganizationID + "1"))
                {
                    ArrayList lld = new ArrayList();
                    lld.Add(dataName[item.OrganizationID + "1"]);
                    lld.Add(dataValue[item.OrganizationID + "1"]);
                    al.Add(lld);
                    nansum += dataValue[item.OrganizationID + "1"];
                }
                if (dataName.ContainsKey(item.OrganizationID + "2"))
                {
                    ArrayList lld = new ArrayList();
                    lld.Add(dataName[item.OrganizationID + "2"]);
                    lld.Add(dataValue[item.OrganizationID + "2"]);
                    al.Add(lld);
                    nsum += dataValue[item.OrganizationID + "2"];
                }
                if (dataName.ContainsKey(item.OrganizationID + "0"))
                {
                    ArrayList lld = new ArrayList();
                    lld.Add(dataName[item.OrganizationID + "0"]);
                    lld.Add(dataValue[item.OrganizationID + "0"]);
                    al.Add(lld);
                    qtsum += dataValue[item.OrganizationID + "0"];
                }
                namelist.Add(new SelectModel() { Name = item.OrgName, Value = index });

                baseList.Add(al);
            }
            //所有机构的值
            List<ArrayList> alllist = new List<ArrayList>();
            if (nansum != 0)
            {
                ArrayList all1 = new ArrayList();
                all1.Add("男");
                all1.Add(nansum);
                alllist.Add(all1);
            }
            if (nsum != 0)
            {
                ArrayList all1 = new ArrayList();
                all1.Add("女");
                all1.Add(nsum);
                alllist.Add(all1);
            }
            if (qtsum != 0)
            {
                ArrayList all1 = new ArrayList();
                all1.Add("其他");
                all1.Add(qtsum);
                alllist.Add(all1);
            }
            namelist.Add(new SelectModel() { Name = "所有机构", Value = namelist.Count() + 1 });
            namelist = namelist.OrderByDescending(a => a.Value).ToList();
            baseList.Add(alllist);

            ChartPieModel m = new ChartPieModel();
            m.MyData = baseList;
            m.SelectNames = namelist;
            response.Data = m;
            return response;
        }

        /// <summary>
        /// 获取所有机构下的男女比例
        /// </summary>
        /// <param name="groupId"></param>
        /// <returns></returns>
        public BaseResponse<ChartPieModel> GetOrgAgeList(int? groupId)
        {
            BaseResponse<ChartPieModel> response = new BaseResponse<ChartPieModel>();
            List<List<ArrayList>> baseList = new List<List<ArrayList>>() { };

            //先找出有数据存在的机构
            var taskOrgquery = from p in unitOfWork.GetRepository<DC_Person>().dbSet
                               join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                                on p.OrganizationID equals org.OrganizationID
                               where org.GroupID == groupId && (DateTime.Now.Year - p.Birthdate.Value.Year) >= 51 && (DateTime.Now.Year - p.Birthdate.Value.Year) <= 200
                               group org by new { org.OrganizationID, org.OrgName } into g
                               select new
                               {
                                   g.Key.OrganizationID,
                                   g.Key.OrgName
                               };
            var allorg = taskOrgquery.ToList();

            //年龄阶段
            //51--60
            //61--70
            //71--80
            //81--90
            //91--100
            //100+

            int[] ageLevel = { 1, 2, 3, 4, 5, 6 };
            int[] Start = { 51, 61, 71, 81, 91, 100 };
            int[] End = { 60, 70, 80, 90, 100, 200 };

            Dictionary<string, string> dataName = new Dictionary<string, string>();
            Dictionary<string, int> dataValue = new Dictionary<string, int>();
            List<SelectModel> namelist = new List<SelectModel>();


            for (int i = 0; i < 5; i++)
            {
                int selectStart = Start[i];
                int selectEnd = End[i];
                var query11 = from p in unitOfWork.GetRepository<DC_Person>().dbSet
                              join org in unitOfWork.GetRepository<ORG_Organization>().dbSet
                               on p.OrganizationID equals org.OrganizationID
                              where org.GroupID == groupId && (DateTime.Now.Year - p.Birthdate.Value.Year) >= selectStart && (DateTime.Now.Year - p.Birthdate.Value.Year) <= selectEnd                     
                              group org by new { org.OrganizationID, org.OrgName } into g
                              select new
                              {
                                  g.Key.OrganizationID,
                                  g.Key.OrgName,
                                  count = g.Count()
                              };
                var list = query11.ToList();
                foreach (var item in list)
                {
                    dataName.Add(item.OrganizationID + (i + 1).ToString(), Start[i] + "-" + End[i]);
                    dataValue.Add(item.OrganizationID + (i + 1).ToString(), item.count);
                }
            }
            int index = 0;
            int[] data = new int[Start.Length];
            foreach (var item in allorg)
            {
                List<ArrayList> al = new List<ArrayList>();
                index++;
                for (int i = 1; i <= 6; i++)
                {
                    if (dataValue.ContainsKey(item.OrganizationID + i.ToString()))
                    {
                        data[i - 1] += dataValue[item.OrganizationID + i.ToString()];
                        ArrayList lld = new ArrayList();
                        lld.Add(dataName[item.OrganizationID + i.ToString()]);
                        lld.Add(dataValue[item.OrganizationID + i.ToString()]);
                        al.Add(lld);
                    }
                }
                namelist.Add(new SelectModel() { Name = item.OrgName, Value = index });
                baseList.Add(al);
            }
            //所有机构的值
            List<ArrayList> alllist = new List<ArrayList>();

            for (int i = 0; i < Start.Length; i++)
            {
                if (data[i] != 0)
                {
                    ArrayList all1 = new ArrayList();
                    all1.Add(Start[i] + "-" + End[i]);
                    all1.Add(data[i]);
                    alllist.Add(all1);
                }
            }
            namelist.Add(new SelectModel() { Name = "所有机构", Value = namelist.Count() + 1 });
            namelist = namelist.OrderByDescending(a => a.Value).ToList();
            baseList.Add(alllist);

            ChartPieModel cm = new ChartPieModel();
            cm.SelectNames = namelist;
            cm.MyData = baseList;
            response.Data = cm;
            return response;
        }

    }

}
