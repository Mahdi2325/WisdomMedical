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
using System.Linq;
using System.Linq.Expressions;
using System.Text.RegularExpressions;
using EntityFramework.Extensions;

namespace KMHC.SLTC.Business.Implement
{
    public class BaseService : IBaseService
    {
        public IUnitOfWork unitOfWork = IOCContainer.Instance.Resolve<IUnitOfWork>();

        public virtual BaseResponse<IList<T>> Query<S, T>(BaseRequest request, Func<IQueryable<S>, IQueryable<S>> whereAndOrderBy) where S : class
        {
            BaseResponse<IList<T>> response = new BaseResponse<IList<T>>();
            //Mapper.CreateMap<S, T>();
            var q = from m in unitOfWork.GetRepository<S>().dbSet
                    select m;

            if (whereAndOrderBy != null)
            {
                q = whereAndOrderBy(q);
            }
            //创建一个参数c
            ParameterExpression param =
                Expression.Parameter(typeof(S), "c");
            //c.IsDeleted=="false"
            Expression left = Expression.Property(param,
                typeof(S).GetProperty("IsDeleted"));
            Expression right = Expression.Constant(false);
            Expression filter = Expression.Equal(left, right);

            Expression pred = Expression.Lambda(filter, param);
            //Where(c=>c.IsDeleted==false)
            //Expression expr = Expression.Call(typeof(Queryable), "Where",
            //    new Type[] { typeof(S) },
            //    Expression.Constant(q), pred);
            //生成动态查询
            //q = q.Provider.CreateQuery<S>(expr);
            q = q.Where((Expression<Func<S, bool>>)pred);

            response.RecordsCount = q.Count();
            List<S> list = null;
            if (request != null && request.PageSize > 0)
            {
                list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
            }
            else
            {
                list = q.ToList();
            }

            //response.Data = Mapper.Map<IList<T>>(list);
            response.Data = Mapper.DynamicMap<IList<T>>(list);
            return response;
        }

        public virtual BaseResponse<T> Get<S, T>(Func<S, bool> where)
            where S : class
            where T : class
        {
            BaseResponse<T> response = new BaseResponse<T>();
            var findItem = unitOfWork.GetRepository<S>().dbSet.FirstOrDefault(where);
            if (findItem != null)
            {
                response.Data = Mapper.DynamicMap<T>(findItem);
            }
            return response;
        }

        public BaseResponse<T> Save<S, T>(T request, Func<S, bool> where)
            where S : class
            where T : class
        {
            return this.Save<S, T>(request, where, null, false);
        }

        public BaseResponse<T> Save<S, T>(T request, Func<S, bool> where, List<string> fields)
            where S : class
            where T : class
        {
            return this.Save<S, T>(request, where, fields, false);
        }

        public BaseResponse<T> Save<S, T>(T request, Func<S, bool> where, List<string> fields, bool reverse)
            where S : class
            where T : class
        {
            BaseResponse<T> response = new BaseResponse<T>();
            Mapper.Reset();
            var cm = Mapper.CreateMap<T, S>();
            if (fields != null)
            {
                if (reverse)
                {
                    cm.ForAllMembers(it => it.Condition(m => !fields.Contains(m.PropertyMap.SourceMember.Name)));
                }
                else
                {
                    cm.ForAllMembers(it => it.Condition(m => fields.Contains(m.PropertyMap.SourceMember.Name)));
                }
            }
            Mapper.CreateMap<S, T>();
            var model = unitOfWork.GetRepository<S>().dbSet.FirstOrDefault(where);
            if (model == null)
            {
                model = Mapper.Map<S>(request);
                unitOfWork.GetRepository<S>().Insert(model);
            }
            else
            {
                Mapper.Map(request, model);
                unitOfWork.GetRepository<S>().Update(model);
            }
            unitOfWork.Save();
            Mapper.Map(model, request);
            response.Data = request;
            return response;
        }

        public BaseResponse<IList<T>> Save<S, T>(IList<T> request, Func<S, bool> where, List<string> fields = null, bool reverse = false)
            where S : class
            where T : class
        {
            BaseResponse<IList<T>> response = new BaseResponse<IList<T>>();
            var cm = Mapper.CreateMap<T, S>();
            if (fields != null)
            {
                if (reverse)
                {
                    cm.ForAllMembers(it => it.Condition(m => !fields.Contains(m.PropertyMap.SourceMember.Name)));
                }
                else
                {
                    cm.ForAllMembers(it => it.Condition(m => fields.Contains(m.PropertyMap.SourceMember.Name)));
                }
            }
            Mapper.CreateMap<S, T>();
            foreach (var item in request)
            {
                var model = unitOfWork.GetRepository<S>().dbSet.FirstOrDefault(where);
                if (model == null)
                {
                    model = Mapper.Map<S>(item);
                    unitOfWork.GetRepository<S>().Insert(model);
                }
                else
                {
                    Mapper.Map(item, model);
                    unitOfWork.GetRepository<S>().Update(model);
                }
            }
            unitOfWork.Save();
            response.Data = request;
            return response;
        }



        public virtual BaseResponse Delete<S>(object key) where S : class
        {
            BaseResponse response = new BaseResponse();
            unitOfWork.GetRepository<S>().Delete(key);
            unitOfWork.Save();
            return response;
        }


        public virtual int Delete<S>(Expression<Func<S, bool>> filter) where S : class
        {
            var rep = unitOfWork.GetRepository<S>();
            var result = rep.Delete(filter);
            unitOfWork.Save();
            return result;
        }

        /// <summary>
        /// 生成主键值
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        public string GeneratePrimaryKeyValue(EnumCodeKey key)
        {
            IUnitOfWork codeRuleUnitOfWork = IOCContainer.Instance.Resolve<IUnitOfWork>();
            var codeRuleRepository = codeRuleUnitOfWork.GetRepository<SYS_CodeRule>();
            BaseRequest<object> request = new BaseRequest<object>();
            //BaseResponse<CodeRuleModel> response = null;
            string codeKey = key.ToString();
            var codeRule = codeRuleRepository.dbSet.Where(it => it.OrganizationID == -1 && it.CodeKey == codeKey).FirstOrDefault();
            //response = this.Get<SYS_CodeRule, CodeRuleModel>((q) => q.OrganizationID == 0 && q.CodeKey == key.ToString());

            if (codeRule == null)
            {
                codeRule = new SYS_CodeRule();
                codeRule.OrganizationID = -1;
                codeRule.CodeKey = Enum.GetName(typeof(EnumCodeKey), key);
                codeRule.FlagRule = "0";
                codeRule.GenerateRule = "{number:11}";
                codeRule.Flag = "0";
                codeRule.SerialNumber = 0;
                codeRuleRepository.Insert(codeRule);
            }
            else
            {
                codeRuleRepository.Update(codeRule);
            }
            var flag = this.ReplaceValue(codeRule.FlagRule);
            if (string.IsNullOrEmpty(codeRule.Flag) || codeRule.Flag != flag)
            {
                codeRule.Flag = flag;
                codeRule.SerialNumber = 1;
            }
            else
            {
                codeRule.SerialNumber++;
            }
            codeRuleUnitOfWork.Save();
            //unitOfWork.BeginTransaction();
            //this.Save<SYS_CodeRule, CodeRuleModel>(response.Data, (q) => q.OrganizationID == 0 && q.CodeKey == response.Data.CodeKey);
            //unitOfWork.Commit();
            return ReplaceValue(codeRule.GenerateRule, codeRule.SerialNumber);
        }

        /// <summary>
        /// 生成编号
        /// </summary>
        /// <param name="key">编码键</param>
        /// <param name="generateRule">规则</param>
        /// <param name="prefix">前缀</param>
        /// <param name="serialNumberLength">流水号长度</param>
        /// <param name="organizationID">机构ID</param>
        /// <returns></returns>
        public string GenerateCode(EnumCodeKey key, EnumCodeRule generateRule, string prefix, int serialNumberLength, int organizationID = -1)
        {
            IUnitOfWork codeRuleUnitOfWork = IOCContainer.Instance.Resolve<IUnitOfWork>();
            var codeRuleRepository = codeRuleUnitOfWork.GetRepository<SYS_CodeRule>();
            BaseRequest<object> request = new BaseRequest<object>();
            //BaseResponse<CodeRuleModel> response = null;
            string codeKey = key.ToString();
            var codeRule = codeRuleRepository.dbSet.Where(it => it.OrganizationID == organizationID && it.CodeKey == codeKey).FirstOrDefault();
            //response = this.Get<SYS_CodeRule, CodeRuleModel>((q) => q.OrganizationID == organizationID && q.CodeKey == key.ToString());

            if (codeRule == null)
            {
                codeRule = new SYS_CodeRule();
                codeRule.OrganizationID = organizationID;
                codeRule.CodeKey = Enum.GetName(typeof(EnumCodeKey), key);
                codeRule.FlagRule = this.GenerateCodeRule(generateRule);
                codeRule.GenerateRule = prefix + (codeRule.FlagRule != "0" ? codeRule.FlagRule : "") + "{number:" + serialNumberLength + "}";
                codeRule.Flag = this.ReplaceValue(codeRule.FlagRule);
                codeRule.SerialNumber = 0;
                codeRuleRepository.Insert(codeRule);
            }
            else
            {
                codeRuleRepository.Update(codeRule);
            }
            var flag = this.ReplaceValue(codeRule.FlagRule);
            if (string.IsNullOrEmpty(codeRule.Flag) || codeRule.Flag != flag)
            {
                codeRule.Flag = flag;
                codeRule.SerialNumber = 1;
            }
            else
            {
                codeRule.SerialNumber++;
            }
            codeRuleUnitOfWork.Save();
            //unitOfWork.BeginTransaction();
            //this.Save<SYS_CodeRule, CodeRuleModel>(response.Data, (q) => q.OrganizationID == organizationID && q.CodeKey == response.Data.CodeKey);
            //unitOfWork.Commit();
            return ReplaceValue(codeRule.GenerateRule, codeRule.SerialNumber);
        }

        private string GenerateCode(int organizationID, EnumCodeKey key)
        {
            BaseRequest<object> request = new BaseRequest<object>();
            BaseResponse<CodeRuleModel> response = null;
            response = this.Get<SYS_CodeRule, CodeRuleModel>((q) => q.OrganizationID == organizationID && q.CodeKey == key.ToString());

            if (response.Data == null)
            {
                { throw new Exception("编码查找創建失败!"); }
            }
            var flag = this.ReplaceValue(response.Data.FlagRule);
            if (string.IsNullOrEmpty(response.Data.Flag) || response.Data.Flag != flag)
            {
                response.Data.OrganizationID = organizationID;
                response.Data.Flag = flag;
                response.Data.SerialNumber = 1;
            }
            else
            {
                response.Data.SerialNumber++;
            }
            unitOfWork.BeginTransaction();
            this.Save<SYS_CodeRule, CodeRuleModel>(response.Data, (q) => q.OrganizationID == organizationID && q.CodeKey == response.Data.CodeKey);
            unitOfWork.Commit();
            return ReplaceValue(response.Data.GenerateRule, response.Data.SerialNumber);
        }

        /// <summary>
        /// 生成规则
        /// </summary>
        /// <param name="codeRule"></param>
        /// <returns></returns>
        private string GenerateCodeRule(EnumCodeRule codeRule)
        {
            string codeRuleString = string.Empty;
            switch (codeRule)
            {
                case EnumCodeRule.Year:
                    codeRuleString = "{time:yyyy}";
                    break;
                case EnumCodeRule.YearMonth:
                    codeRuleString = "{time:yyyyMM}";
                    break;
                case EnumCodeRule.YearMonthDay:
                    codeRuleString = "{time:yyyyMMdd}";
                    break;
                //case EnumCodeRule.YearMonthDayH:
                //    codeRuleString = "{time:yyyyMMddHH}";
                //    break;
                case EnumCodeRule.None:
                    codeRuleString = "0";
                    break;
            }
            return codeRuleString;
        }

        /// <summary>
        /// 例如生成 D201601-0001
        /// </summary>
        /// <param name="formatString">D{time:yyyyMM}-{number:4}</param>
        /// <param name="serialNumber">0</param>
        /// <returns></returns>
        private string ReplaceValue(string formatString, decimal serialNumber = 0)
        {
            const string pattern = @"(?<={)[\w:]+(?=})";
            var ms = Regex.Matches(formatString, pattern);
            foreach (Match m in ms)
            {
                var arr = m.Value.Split(':');
                if (arr.Length == 2)
                {
                    var value = string.Empty;
                    switch (arr[0].ToLower())
                    {
                        //case "left":
                        //    value = inputValue.Substring(0, int.Parse(arr[1]));
                        //    break;
                        case "time":
                            value = DateTime.Now.ToString(arr[1]);
                            break;
                        case "number":
                            value = serialNumber.ToString().PadLeft(int.Parse(arr[1]), '0');
                            break;
                    }
                    formatString = formatString.Replace("{" + m.Value + "}", value);
                }
            }
            return formatString;
        }


        public int GetPagesCount(int pageSize, int total)
        {
            if (pageSize <= 0)
            {
                return 1;
            }
            var count = total / pageSize;
            if (total % pageSize > 0)
            {
                count += 1;
            }
            return count;
        }

        public string CreateNo()
        {
            Random ran = new Random();
            return DateTime.Now.ToString("yyyyMMddHHmmss") + ran.Next(0, 10000).ToString();
        }

    }
}
