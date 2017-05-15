namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;

    public interface IEvaluationService : IBaseService
    {
        #region DC_Evaluation
        /// <summary>
        /// 获取DC_Evaluation列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<EvaluationModel>> QueryEvaluation(BaseRequest<EvaluationFilter> request);
                
        /// <summary>
        /// 获取DC_Evaluation列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<EmpEvlModel>> QueryEmpWithEvluation(BaseRequest<EmployeeFilter> request);
        /// <summary>
        /// 获取DC_Evaluation
        /// </summary>
        /// <param name="evaluationID"></param>
        /// <returns></returns>
        BaseResponse<EvaluationModel> GetEvaluation(int evaluationID);
        /// <summary>
        /// 保存DC_Evaluation
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<EvaluationModel> SaveEvaluation(EvaluationModel request);
        /// <summary>
        /// 删除DC_Evaluation
        /// </summary>
        /// <param name="evaluationID"></param>
        BaseResponse DeleteEvaluation(int EvaluationID);
        #endregion
    }
}
