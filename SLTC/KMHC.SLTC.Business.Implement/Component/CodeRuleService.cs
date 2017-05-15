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
    
    public partial class CodeRuleService : BaseService, ICodeRuleService
    {
        #region SYS_CodeRule
        public BaseResponse<IList<CodeRuleModel>> QueryCodeRule(BaseRequest<CodeRuleFilter> request)
        {
            var response = base.Query<SYS_CodeRule, CodeRuleModel>(request, (q) =>
            {
                if (request.Data.CodeRuleID != 0)
                {
                    q = q.Where(m => m.CodeRuleID == request.Data.CodeRuleID);
                }
                q = q.OrderBy(m => m.CodeRuleID);
                return q;
            });
            return response;
        }

        public BaseResponse<CodeRuleModel> GetCodeRule(int codeRuleID)
        {
            return base.Get<SYS_CodeRule, CodeRuleModel>((q) => q.CodeRuleID == codeRuleID);
        }

        public BaseResponse<CodeRuleModel> SaveCodeRule(CodeRuleModel request)
        {
            return base.Save<SYS_CodeRule, CodeRuleModel>(request, (q) => q.CodeRuleID == request.CodeRuleID);
        }

        public BaseResponse DeleteCodeRule(int codeRuleID)
        {
            return base.Delete<SYS_CodeRule>(codeRuleID);
        }

        public string GenerateCodeRule(CodeRuleFilter codeRule)
        {
            if (!Enum.IsDefined(typeof(EnumCodeKey), codeRule.CodeKey)) {
                return "CodeKey不存在EnumCodeKey枚举中，请先添加相应的枚举值。";
            }
            if (!Enum.IsDefined(typeof(EnumCodeRule), codeRule.GenerateRule))
            {
                return "GenerateRule不存在EnumCodeRule枚举中，请先添加相应的枚举值。";
            }
            return base.GenerateCode(
                (EnumCodeKey)Enum.Parse(typeof(EnumCodeKey), codeRule.CodeKey),
                (EnumCodeRule)Enum.Parse(typeof(EnumCodeRule), codeRule.GenerateRule),
                codeRule.Prefix,
                codeRule.SerialNumberLength,
                codeRule.OrganizationID);
        }
        #endregion
    }
}
