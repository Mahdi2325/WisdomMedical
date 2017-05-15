/*
 * 描述:检查项目
 *  
 * 修订历史: 
 * 日期       修改人              Email                  内容
 * 20151016   郝元彦              haoyuanyan@gmail.com   创建 
 *  
 */

namespace KMHC.SLTC.WebUI.Model.External.HealthRecord
{
    public class ExamineItem 
    {
        public int ItemId { get; set; }
        /// <summary>
        /// 检查项目代码
        /// </summary>
        public string ItemCode { get; set; }

        /// <summary>
        /// 检查项目名称
        /// </summary>
        public string ItemName { get; set; }

        /// <summary>
        /// 数据元值的数据类型
        /// </summary>
        public string ValueType { get; set; }

        /// <summary>
        /// 数据元值域代码
        /// </summary>
        public string CodeValue { get; set; }
        /// <summary>
        /// 描述或备注
        /// </summary>
        public string Description { get; set; }



    }
}
