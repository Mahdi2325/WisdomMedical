using NPOI.SS.Formula.Functions;

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
    using System.Linq;

    public partial class RoleService : BaseService, IRoleService
    {
        #region SYS_Role
        public BaseResponse<IList<RoleModel>> QueryRole(BaseRequest<RoleFilter> request)
        {
            var response = base.Query<SYS_Role, RoleModel>(request, (q) =>
            {
                if (request != null && request.Data != null)
                {
                    if (request.Data.RoleID.HasValue && request.Data.RoleID > 0)
                    {
                        q = q.Where(m => m.RoleID == request.Data.RoleID);
                    }
                    if (!string.IsNullOrEmpty(request.Data.RoleName))
                    {
                        q = q.Where(m => m.RoleName.Contains(request.Data.RoleName.Trim()));
                    }
                }
                q = q.OrderBy(m => m.RoleID);
                return q;
            });
            return response;
        }

        public BaseResponse<RoleModel> GetRole(int roleID)
        {
            var role = base.unitOfWork.GetRepository<SYS_Role>();
            var menu = base.unitOfWork.GetRepository<SYS_Menu>();


            BaseResponse<RoleModel> response = new BaseResponse<RoleModel>();
            var model = role.dbSet.FirstOrDefault(f => f.RoleID == roleID && f.IsDeleted == false);
            if (model == null)
            {
                response.IsSuccess = false;
                return response;
            }

            Mapper.CreateMap<SYS_Menu, MenuModel>().ForMember(dest => dest.Functions, options => options.MapFrom(f => f.SYS_MenuFunction.OrderBy(a=>a.OrderSeq)));

            response.Data = Mapper.DynamicMap<SYS_Role, RoleModel>(model);

            var mu = menu.dbSet.Where(w => w.RoleID == roleID && w.IsDeleted == false).OrderBy(a=>a.OrderSeq);
            if (mu.Any())
            {
                response.Data.MenuItems = Mapper.DynamicMap<List<SYS_Menu>, List<MenuModel>>(mu.ToList());
            }
            return response;
        }

        public BaseResponse<RoleModel> SaveRole(RoleModel request)
        {
            BaseResponse<RoleModel> response = new BaseResponse<RoleModel>() { Data = request };
            var role = base.unitOfWork.GetRepository<SYS_Role>();
            SYS_Role model;
            if (request.RoleID > 0)
            {
                model = role.dbSet.FirstOrDefault(f => f.RoleID == request.RoleID && f.IsDeleted == false);
                if (model != null)
                {
                    model.DefaultPage = request.DefaultPage;
                    model.Description = request.Description;
                    model.RoleName = request.RoleName;
                    role.Update(model);
                }
                else
                {
                    response.IsSuccess = false;
                    return response;
                }
            }
            else
            {
                model = role.dbSet.FirstOrDefault(f => f.RoleNo == request.RoleNo && f.IsDeleted == false);
                if (model != null)
                {
                    response.IsSuccess = false;
                    response.ResultMessage = string.Format("{0} {1} 已存在", request.RoleNo, request.RoleName);
                    return response;
                }

                model = new SYS_Role
                {
                    RoleNo =  GenerateCode(EnumCodeKey.RoleCode, EnumCodeRule.None, "R", 3, 0),
                    DefaultPage = request.DefaultPage,
                    Description = request.Description,
                    IsDeleted = false,
                    RoleName = request.RoleName
                };
                role.Insert(model);
                base.unitOfWork.Save();
            }
            SaveMenu(model.RoleID, request);
            return response;
        }

        public BaseResponse DeleteRole(int roleID)
        {
            return base.Delete<SYS_Role>(roleID);
        }
        /// <summary>
        /// 超级管理菜单
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public IEnumerable<FunctionModel> GetRoleFunction(RoleFunctionFilter request)
        {
            var modules = unitOfWork.GetRepository<SYS_Function>().dbSet.Where(o => o.IsIndependent && !o.IsDeleted).Distinct().OrderBy(o=>o.OrderSeq);
            //Mapper.CreateMap<SYS_Function, FunctionModel>();
            //return Mapper.Map<IEnumerable<FunctionModel>>(modules.ToList());
            return Mapper.DynamicMap<IEnumerable<FunctionModel>>(modules.ToList());
        }

        /// <summary>
        /// 普通用户菜单
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        public IEnumerable<FunctionModel> GetRoleMenu(RoleFunctionFilter request)
        {
            //Mapper.CreateMap<SYS_Menu, Menu>();
            IEnumerable<FunctionModel> response = null;
            var menus = Mapper.DynamicMap<IEnumerable<Menu>>(unitOfWork.GetRepository<SYS_Menu>().dbSet.Where(o => !o.IsDeleted && o.RoleID == request.RoleID)).OrderBy(o => o.OrderSeq).ToList();
            if (menus.Count <= 0)
            {
                return response;
            }
            var menuIds = menus.Select(m => m.MenuID).ToArray();
            //获取子菜单
            var functions =
                (from m in unitOfWork.GetRepository<SYS_MenuFunction>().dbSet.Where(o => menuIds.Contains(o.MenuID.Value))
                 join f in unitOfWork.GetRepository<SYS_Function>().dbSet.Where(o => o.IsIndependent) on m.FunctionID equals f.FunctionID
                 select new FunctionModel
                 {
                     FunctionID = f.FunctionID,
                     FunctionNo = f.FunctionNo,
                     FunctionName = m.MenuName,
                     ModuleName = f.ModuleName,
                     IsIndependent = f.IsIndependent,
                     Url = f.Url,
                     MenuID = m.MenuID.Value,
                     OrderSeq = m.OrderSeq
                 });

            foreach (var menu in menus)
            {
                response = functions.Where(o => o.MenuID == menu.MenuID).Distinct().OrderBy(o => o.OrderSeq).ToList();
            }
            return response;
        }

        #endregion


        #region 私有区域

        private void SaveMenu(int roleId, RoleModel request)
        {
            if (request.MenuItems != null && request.MenuItems.Any())
            {
                Mapper.CreateMap<MenuModel, SYS_Menu>().ForMember(dest => dest.SYS_MenuFunction, options =>
                {
                    options.Condition(c => c.Functions != null && c.Functions.Any());
                    options.MapFrom(m => m.Functions);
                });
                Mapper.CreateMap<MenuFunction, SYS_MenuFunction>();

                var menu = base.unitOfWork.GetRepository<SYS_Menu>();
                var query = menu.dbSet.Where(w => w.RoleID == roleId && w.IsDeleted == false);
                var dic = request.MenuItems.Where(w => w.MenuID > 0).ToDictionary(f => f.MenuID);
                if (query.Any())
                {
                    var models = query.ToList();
                    //处理已存在的菜单
                    var ex = models.Where(f => dic[f.MenuID] != null).ToList();
                    if (ex.Any())
                    {
                        foreach (var sysMenu in ex)
                        {
                            var d = dic[sysMenu.MenuID];
                            sysMenu.MenuName = d.MenuName;
                            sysMenu.OrderSeq = d.OrderSeq;
                            if (d.Functions != null && d.Functions.Any())
                            {
                                foreach (var sysMenuFunction in d.Functions)
                                {
                                    //修改
                                    var smf = sysMenu.SYS_MenuFunction.FirstOrDefault(w => w.MenuFunctionID == sysMenuFunction.MenuFunctionID);
                                    if (sysMenuFunction.MenuFunctionID != 0 && smf != null)
                                    {
                                        smf.MenuName = sysMenuFunction.MenuName;
                                        smf.OrderSeq = sysMenuFunction.OrderSeq;
                                        smf.FunctionID = sysMenuFunction.FunctionID;
                                    }
                                    else
                                    {
                                        //新增
                                        sysMenu.SYS_MenuFunction.Add(new SYS_MenuFunction()
                                        {
                                            MenuID = sysMenuFunction.MenuID,
                                            FunctionID = sysMenuFunction.FunctionID,
                                            OrderSeq = sysMenuFunction.OrderSeq,
                                            MenuName = sysMenuFunction.MenuName,
                                            CreatedTime = DateTime.Now,
                                            ModifiedTime = DateTime.Now

                                        });
                                    }
                                }
                                //删除
                                var del = sysMenu.SYS_MenuFunction.Where(w => !d.Functions.Exists(e => e.MenuFunctionID == w.MenuFunctionID)).ToList();
                                if (del.Any())
                                {
                                    foreach (var xx in del)
                                    {
                                        sysMenu.SYS_MenuFunction.Remove(xx);
                                    }
                                }
                            }
                            else
                            {
                                sysMenu.SYS_MenuFunction.Clear();
                            }

                            menu.Update(sysMenu);
                        }
                    }

                    //先处理删除的菜单
                    var delRole = models.Where(w => !ex.Exists(e => e.RoleID == w.RoleID));
                    foreach (var sysMenu in delRole)
                    {
                        sysMenu.IsDeleted = false;
                        menu.Update(sysMenu);
                    }
                    //在处理新增的菜单
                    var newRole = request.MenuItems.Where(w => w.MenuID == 0);
                    foreach (var item in newRole)
                    {
                        item.RoleID = roleId;
                        menu.Insert(Mapper.Map<MenuModel, SYS_Menu>(item));
                    }
                }
                else
                {
                    //新增的菜单
                    foreach (var item in request.MenuItems)
                    {
                        item.RoleID = roleId;
                        var model = Mapper.Map<MenuModel, SYS_Menu>(item);
                        menu.Insert(model);
                    }
                }
                base.unitOfWork.Save();
            }
            else
            {
                var menu = base.unitOfWork.GetRepository<SYS_Menu>();
                menu.Delete(f => f.RoleID == roleId);
                base.unitOfWork.Save();
            }
        }

        #endregion
    }
}
