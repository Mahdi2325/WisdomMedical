namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IFunctionService : IBaseService
    {
        #region SYS_Function
        /// <summary>
        /// 获取SYS_Function列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<FunctionModel>> QueryFunction(BaseRequest<FunctionFilter> request);
        /// <summary>
        /// 获取SYS_Function
        /// </summary>
        /// <param name="functionID"></param>
        /// <returns></returns>
        BaseResponse<FunctionModel> GetFunction(int functionID);
        /// <summary>
        /// 保存SYS_Function
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<FunctionModel> SaveFunction(FunctionModel request);
        /// <summary>
        /// 删除SYS_Function
        /// </summary>
        /// <param name="functionID"></param>
        BaseResponse DeleteFunction(int functionID);
        #endregion

        BaseResponse<bool> SaveBatchFunction(List<FunctionModel> baseRequest);
    }
}
