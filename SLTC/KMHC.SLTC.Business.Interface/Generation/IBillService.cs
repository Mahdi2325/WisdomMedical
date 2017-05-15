namespace KMHC.SLTC.Business.Interface
{
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using System.Collections.Generic;
    
    public interface IBillService : IBaseService
    {
        #region DC_Bill
        /// <summary>
        /// 获取DC_Bill列表
        /// </summary>
        /// <param name="request"></param>
        /// <returns></returns>
        BaseResponse<IList<BillModel>> QueryBill(BaseRequest<BillFilter> request);
        /// <summary>
        /// 获取DC_Bill
        /// </summary>
        /// <param name="billID"></param>
        /// <returns></returns>
        BaseResponse<BillModel> GetBill(int billID);
        /// <summary>
        /// 保存DC_Bill
        /// </summary>
        /// <param name="request"></param>
        BaseResponse<BillModel> SaveBill(BillModel request);
        /// <summary>
        /// 删除DC_Bill
        /// </summary>
        /// <param name="billID"></param>
        BaseResponse DeleteBill(int billID);
        #endregion
    }
}
