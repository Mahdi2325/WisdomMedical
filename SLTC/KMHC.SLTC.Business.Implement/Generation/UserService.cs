using KMHC.Infrastructure;
using KMHC.Infrastructure.Security;

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
    using System.Collections.Generic;
    using System.Collections;
    using System.Linq;
    using System.Linq.Expressions;

    public partial class UserService : BaseService, IUserService
    {
        #region SYS_User
        public BaseResponse<IList<UserModel>> QueryUser(BaseRequest<UserFilter> request)
        {
            BaseResponse<IList<UserModel>> response = new BaseResponse<IList<UserModel>>();
            var user = base.unitOfWork.GetRepository<SYS_User>().dbSet;
            var ur = base.unitOfWork.GetRepository<SYS_UserRelation>().dbSet;
            var employee = base.unitOfWork.GetRepository<ORG_Employee>().dbSet;
            string userRelationType = Enum.GetName(typeof(UserRelationType), UserRelationType.UserEmployee);
            var query = from sysUser in user
                        join emprelation in ur on new { sysUser.UserID, RelationType = userRelationType, IsDeleted = false } equals new { emprelation.UserID, emprelation.RelationType, emprelation.IsDeleted } into eurd
                        from y in eurd.DefaultIfEmpty()
                        join empl in employee on new { Id = y.RelationID, IsDeleted = false } equals new { Id = empl.EmployeeID, empl.IsDeleted } into ee
                        from epd in ee.DefaultIfEmpty()
                        where sysUser.IsDeleted == false
                        select new { user = sysUser, emp = ee };

            if (request != null)
            {
                if (request.Data.UserID != 0)
                {
                    query = query.Where(e => e.user.UserID == request.Data.UserID);
                }

                if (request.Data.OrganizationID > 0)
                {
                    query = query.Where(w => w.user.ORG_Organization.Any(a => a.OrganizationID == request.Data.OrganizationID));
                }
                else if (request.Data.IsSupperAdmin)// //1. 超级管理员登录：显示系统内所有集团管理员(R100)、系统管理员账号(R001)
                {
                    query = query.Where(w => w.user.SYS_Role.Any(a => a.RoleNo == "R100" || a.RoleNo == "R001"));
                }
                else if (request.Data.IsGroupAdmin && request.Data.GroupId > 0)   //2. 集团管理员登录：只显示本集团所属机构的系统管理员列表，
                {
                    query = query.Where(w => w.user.SYS_Role.Any(a => a.RoleNo == "R001"));
                    query = query.Where(w => w.user.ORG_Group.Any(a => a.GroupID == request.Data.GroupId));
                }

                if (!string.IsNullOrEmpty(request.Data.UserName))
                {
                    query = query.Where(w => w.user.DisplayName.Contains(request.Data.UserName.Trim()) || w.user.AccountName.Contains(request.Data.UserName.Trim()));
                }
               
            }

            response.RecordsCount = query.Count();
            if (response.RecordsCount > 0)
            {
                if (request != null)
                {
                    query = query.OrderBy(w => w.user.UserID).Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize);
                    if (request.PageSize > 0)
                    {
                        response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                    }
                }

                List<UserModel> list = new List<UserModel>();
                query.ToList().ForEach(f =>
                {
                    var m = Mapper.DynamicMap<SYS_User, UserModel>(f.user);
                    m.Password = string.Empty;//密码
                    if (f.user.ORG_Organization != null && f.user.ORG_Organization.Any())
                    {
                        m.OrganizationName = string.Join("  ", f.user.ORG_Organization.Select(s => s.OrgName));
                    }
                    if (f.user.ORG_Group != null && f.user.ORG_Group.Any())
                    {
                        m.GroupName = string.Join("  ", f.user.ORG_Group.Select(s => s.GroupName));
                    }
                    var r = f.user.SYS_Role.FirstOrDefault();
                    if (r != null)
                    {
                        m.Role = Mapper.DynamicMap<SYS_Role, RoleModel>(r);
                    }
                    var e = f.emp.FirstOrDefault();
                    if (e != null)
                    {
                        m.Employee = Mapper.DynamicMap<ORG_Employee, EmployeeModel>(e);
                    }
                    list.Add(m);
                });
                response.Data = list;
            }

            return response;
        }

        public BaseResponse<UserModel> GetUser(int userID)
        {
            return base.Get<SYS_User, UserModel>((q) => q.UserID == userID);
        }

        public BaseResponse<UserModel> SaveUser(UserModel request)
        {
            BaseResponse<UserModel> response = new BaseResponse<UserModel>();

            var user = base.unitOfWork.GetRepository<SYS_User>();
            var ur = base.unitOfWork.GetRepository<SYS_UserRelation>();
            var role = base.unitOfWork.GetRepository<SYS_Role>();
            var employee = base.unitOfWork.GetRepository<ORG_Employee>();
            var org = base.unitOfWork.GetRepository<ORG_Organization>();
            var group = base.unitOfWork.GetRepository<ORG_Group>();

            try { 
                SYS_User userModel;
                if (request.UserID > 0)
                {
                    userModel = user.dbSet.FirstOrDefault(f => f.UserID == request.UserID && f.IsDeleted == false);
                    if (userModel == null)
                    {
                        response.IsSuccess = false;
                        response.ResultMessage = "不存在的账号信息。";
                        return response;
                    }
                    userModel.ModifiedTime = DateTime.Now;
                    userModel.DisplayName = request.DisplayName;
                    if (!string.IsNullOrEmpty(request.Password))
                    {
                        userModel.Password = Util.Md5(request.Password + request.AccountName);
                    }
                    user.Update(userModel);
                }
                else
                {
                    userModel = user.dbSet.FirstOrDefault(f => f.AccountName == request.AccountName.Trim() && f.IsDeleted == false);
                    if (userModel != null)
                    {
                        response.IsSuccess = false;
                        response.ResultMessage = string.Format("用户名:{0} 已存在!", request.AccountName);
                        return response;
                    }

                    var orgModel = org.dbSet.FirstOrDefault(w => w.OrganizationID == request.OrganizationID);

                    var groupModel = group.dbSet.FirstOrDefault(w => w.GroupID == request.GroupID);

                    userModel = new SYS_User
                    {
                        AccountName = request.AccountName.Trim(),
                        Password = Util.Md5(request.Password + request.AccountName),
                        DisplayName = request.DisplayName,
                        IsDeleted = false,
                        CreatedTime = DateTime.Now,
                        ORG_Organization = new List<ORG_Organization>() { orgModel },
                        ORG_Group = new List<ORG_Group>() { groupModel }
                    };
                    user.Insert(userModel);
                    base.unitOfWork.Save();
                }

                #region 用户关系

                if (request.RoleId > 0)
                {
                    var r = role.dbSet.FirstOrDefault(f => f.RoleID == request.RoleId && f.IsDeleted == false);
                    if (r == null)
                    {
                        response.IsSuccess = false;
                        response.ResultMessage = "所选角色不存在。";
                        return response;
                    }

                    if (userModel.SYS_Role != null)
                    {
                        userModel.SYS_Role.Clear();
                        var urole = userModel.SYS_Role.FirstOrDefault(x => x.RoleID == r.RoleID);
                        if (urole == null)
                        {
                            userModel.SYS_Role.Add(r);
                            user.Update(userModel);
                        }
                    }
                    else
                    {
                        userModel.SYS_Role = new List<SYS_Role>()
                        {
                            r
                        };
                        user.Update(userModel);
                    }

                }
                if (request.Employee != null && request.Employee.EmployeeID > 0)
                {
                    var e = employee.dbSet.FirstOrDefault(f => f.EmployeeID == request.Employee.EmployeeID && f.IsDeleted == false);
                    if (e == null)
                    {
                        response.IsSuccess = false;
                        response.ResultMessage = "员工信息找不到。";
                        return response;
                    }
                    string userRelationType = Enum.GetName(typeof(UserRelationType), UserRelationType.UserEmployee);
                    var uemp = ur.dbSet.FirstOrDefault(f => f.IsDeleted == false && f.UserID == userModel.UserID && f.RelationType == userRelationType);
                    if (uemp != null)
                    {
                        if (uemp.RelationID != request.Employee.EmployeeID)
                        {
                            uemp.RelationID = request.Employee.EmployeeID;
                            uemp.ModifiedTime = DateTime.Now;
                            ur.Update(uemp);
                        }
                    }
                    else
                    {
                        ur.Insert(new SYS_UserRelation()
                        {
                            CreatedTime = DateTime.Now,
                            IsDeleted = false,
                            RelationID = request.Employee.EmployeeID,
                            UserID = userModel.UserID,
                            RelationType = Enum.GetName(typeof(UserRelationType), UserRelationType.UserEmployee)
                        });
                    }
                }
                base.unitOfWork.Save();
            #endregion
            }catch(Exception ex){
                response.IsSuccess = false;
                response.ResultMessage = "用户信息保存失败。";
                return response;
            }
            return response;
        }

        public BaseResponse DeleteUser(int userID)
        {
            var userRepository = unitOfWork.GetRepository<SYS_User>();
            var model = userRepository.dbSet.FirstOrDefault(m => m.UserID == userID);
            if (model!=null)
            {
                model.IsDeleted = true;
                model.ModifiedTime = DateTime.Now;
                userRepository.Update(model);
                unitOfWork.Save();
            }
            return new BaseResponse();
        }

        public BaseResponse<UserModel> Login(UserModel baseRequest)
        {
            return base.Get<SYS_User, UserModel>((q) => q.AccountName == baseRequest.AccountName && q.Password == baseRequest.Password);
        }
        public BaseResponse<string> ChangePassword(string userId, string newPassword, string oldPassword)
        {
            BaseResponse<string> response = new BaseResponse<string>();
            var model = unitOfWork.GetRepository<SYS_User>().dbSet.FirstOrDefault(m => m.AccountName == userId);
            if (model != null)
            {
                if (model.Password == Util.Md5(oldPassword + model.AccountName))
                {
                    model.Password = Util.Md5(newPassword + model.AccountName);
                    model.ModifiedTime = DateTime.Now;
                    unitOfWork.GetRepository<SYS_User>().Update(model);
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
                response.ResultMessage = "用户信息为空";
            }
            return response;
        }

        public bool Login(string name, string pwd, out ClientUserData user)
        {
            user = null;
            if (string.IsNullOrEmpty(name) || string.IsNullOrEmpty(pwd))
            {
                return false;
            }
            var sysUser = unitOfWork.GetRepository<SYS_User>().dbSet.FirstOrDefault(q => q.IsDeleted == false && q.AccountName == name && q.Password == pwd);
            if (sysUser == null) return false;
            //Mapper.CreateMap<SYS_User, UserModel>();
            var Orgs = sysUser.ORG_Organization.Where(o => !o.IsDeleted).ToList();
            var roles = sysUser.SYS_Role.Where(o => !o.IsDeleted).Select(o => new { o.RoleID, o.RoleName }).ToArray();
           // var groupIds = sysUser.ORG_Group.Where(o => !o.IsDeleted).Select(o => o.GroupID).ToArray();
            var groupIds = sysUser.ORG_Organization.Where(o => !o.IsDeleted).Select(o => o.GroupID).FirstOrDefault();
            var contactAddress = sysUser.ORG_Organization.Where(o => !o.IsDeleted).Select(o => new {o.Address,o.City}).FirstOrDefault();
            var tel = sysUser.ORG_Organization.Where(o => !o.IsDeleted).Select(o => o.Tel).FirstOrDefault();
            if(groupIds==null)
            {
                groupIds = sysUser.ORG_Group.Where(o => !o.IsDeleted).Select(o => o.GroupID).ToArray().FirstOrDefault();
            }
            var tmp = Mapper.DynamicMap<UserModel>(sysUser);
            var roleType = Enum.GetName(typeof(RoleType), RoleType.Other);
            if(roles[0].RoleName.IndexOf("收费员")!=-1 ){
                roleType = Enum.GetName(typeof(RoleType), RoleType.TollCollector);
            }
            else if (roles[0].RoleName.IndexOf("医疗") != -1)
            {
                roleType = Enum.GetName(typeof(RoleType), RoleType.MedicalPerson);
            }
            else if (roles[0].RoleName.IndexOf("派遣服务") != -1)
            {
                roleType = Enum.GetName(typeof(RoleType), RoleType.ServicePerson);
            }

            user = new ClientUserData()
            {
                UserId = tmp.UserID,
                LoginName = tmp.AccountName,
                EmpName = tmp.DisplayName,
                OrgId = Orgs.Count() > 0 ? Orgs[0].OrganizationID : 0,
                RoleId = roles.Length > 0 ? roles[0].RoleID : 0,
                RoleType = roleType,
                GroupId = groupIds.HasValue ? groupIds.Value : 0,
                OrgAddress = contactAddress==null?"":(contactAddress.City + contactAddress.Address),
                OrgPhone = tel,
                IsSurperAdmin = sysUser.SYS_Role.Any(o => o.RoleNo == "R000"),
                IsGroupAdmin = sysUser.SYS_Role.Any(o => o.RoleNo == "R100"),
                OrgIds = Orgs.Select(a=>a.OrganizationID).ToArray(),
                LogoPath = Orgs.Count() > 0 ? Orgs[0].LogoPath : ""
            };
            if (user.IsSurperAdmin || user.IsGroupAdmin)
            {
                user.OrgId = -1;
            }
            var empsrv = new EmployeeService();
            var emp = empsrv.GetEmployees(user.UserId);
            var firstOrDefault = emp.FirstOrDefault();
            if (firstOrDefault != null)
            {
                if (firstOrDefault.EmpState!="001")
                {
                    return false;
                }
                user.EmpId = firstOrDefault.EmployeeID;
                user.DeptID = firstOrDefault.DeptID;
                user.CheckRoomID = firstOrDefault.CheckRoomID;
            };
            return true;
        }
        #endregion
    }
}
