namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface ICodeRuleService : IBaseService
    {
        #region SYS_CodeRule
        /// <summary>
        /// 获取SYS_CodeRule列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<CodeRuleModel>> QueryCodeRule(BaseRequest<CodeRuleFilter> request);
        /// <summary>
        /// 获取SYS_CodeRule
        /// </summary>
        /// <param name="codeRuleID"></param>
        /// <returns></returns>
        BaseResponse<CodeRuleModel> GetCodeRule(int codeRuleID);
        /// <summary>
        /// 保存SYS_CodeRule
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<CodeRuleModel> SaveCodeRule(CodeRuleModel request);
        /// <summary>
        /// 删除SYS_CodeRule
        /// </summary>
        /// <param name="codeRuleID"></param>
        BaseResponse DeleteCodeRule(int codeRuleID);
        string GenerateCodeRule(CodeRuleFilter codeRule);
        #endregion
    }
}
