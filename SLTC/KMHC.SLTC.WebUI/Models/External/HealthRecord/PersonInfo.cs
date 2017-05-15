/*
 * 描述:个人基本信息
 *  
 * 修订历史: 
 * 日期       修改人              Email                  内容
 * 20151015   郝元彦              haoyuanyan@gmail.com   创建 
 *  
 */

using System;

namespace KMHC.SLTC.WebUI.Model.External.HealthRecord
{
    public class PersonInfo
    {
        public int PersonId { get; set; }
        /// <summary>
        /// 病人唯一编号,一般指身份证号
        /// </summary>
        public string PersonNo { get; set; }

        #region 1. 居民基本资料

        #region 1.1 基本情况

        /// <summary>
        /// 城乡居民健康档案编号
        /// </summary>
        public string RecordNo { get; set; }
        /// <summary>
        /// 本人姓名
        /// </summary>
        public string Name { get; set; }
        /// <summary>
        /// 性别代码
        /// </summary>
        public string Gender { get; set; }

        /// <summary>
        /// 出生日期
        /// </summary>
        public string BirthDate { get; set; }
        /// <summary>
        /// 国籍
        /// </summary>
        public string Country { get; set; }
        /// <summary>
        /// 民族
        /// </summary>
        public string Nationality { get; set; }
        /// <summary>
        /// 婚姻状况代码
        /// </summary>
        public string MarriageStatus { get; set; }
        /// <summary>
        /// 身份证件类别代码
        /// </summary>
        public string IDType { get; set; }
        /// <summary>
        /// 身份证件号码
        /// </summary>
        public string IDNumber { get; set; }
        #endregion

        #region 1.2 联系方式
        /// <summary>
        /// 本人电话号码
        /// </summary>
        public string Phone { get; set; }
        /// <summary>
        /// 联系人姓名
        /// </summary>
        public string ContactName { get; set; }

        /// <summary>
        /// 联系人电话
        /// </summary>
        public string ContactPhone { get; set; }
        /// <summary>
        /// 电子邮件地址
        /// </summary>
        public string EmailAddress { get; set; }
        #endregion

        #region 1.3 地址
        /// <summary>
        /// 常住地址户籍标识
        /// </summary>
        public string CensusRegisterFlag { get; set; }

        /// <summary>
        /// 户籍地址代码
        /// </summary>
        public string CensusAddressCode { get; set; }
        /// <summary>
        /// 户籍地址描述
        /// </summary>
        public string CensusAddressName { get; set; }
        /// <summary>
        /// 户籍地址邮编
        /// </summary>
        public string CensusPostCode { get; set; }
        /// <summary>
        /// 现住址代码
        /// </summary>
        public string CurrentAddressCode { get; set; }
        /// <summary>
        /// 现住址描述
        /// </summary>
        public string CurrentAddressName { get; set; }
        /// <summary>
        /// 现住址邮编
        /// </summary>
        public string CurrentPostCode { get; set; }
        #endregion

        #region 1.4 学历和工作情况
        /// <summary>
        /// 工作单位名称
        /// </summary>
        public string Company { get; set; }
        /// <summary>
        /// 参加工作日期
        /// </summary>
        public string HireDate { get; set; }
        /// <summary>
        /// 职业类别代码
        /// </summary>
        public string OccupationClass { get; set; }
        /// <summary>
        /// 学历代码
        /// </summary>
        public string EducationLevel { get; set; }
        #endregion

        #region 1.5 医保情况

        /// <summary>
        /// 医疗保险类别代码
        /// </summary>
        public string InsuranceType { get; set; }
        /// <summary>
        /// 医疗保险名称
        /// </summary>
        public string InsuranceTypeName { get; set; }
        /// <summary>
        /// 医疗费用支付方式代码
        /// </summary>
        public string PayMethod { get; set; }

        #endregion

        #endregion

        #region 2.居民健康资料

        #region  2.1 血型
        /// <summary>
        /// ABO血型代码
        /// </summary>
        public string ABOType { get; set; }
        /// <summary>
        /// RH血型代码
        /// </summary>
        public string RHType { get; set; }
        #endregion

        #region 2.2 过敏
        /// <summary>
        /// 过敏源
        /// </summary>
        public string AllergyHistory { get; set; }
        #endregion

        #region 2.3 危险因素
        /// <summary>
        /// 健康危险因素暴露类别代码
        /// </summary>
        public string RiskFactors { get; set; }
        #endregion

        #region 2.4 残疾情况
        /// <summary>
        /// 残疾情况代码
        /// </summary>
        public string DisabilityStatus { get; set; }
        #endregion

        #endregion

        #region 3.居民社区资料

        /// <summary>
        /// 居委会名称
        /// </summary>
        public string Community { get; set; }

        /// <summary>
        /// 居委会联系人姓名
        /// </summary>
        public string CommunityContact { get; set; }
        /// <summary>
        /// 居委会联系人电话
        /// </summary>
        public string CommunityContactPhone { get; set; }

        #endregion

        #region 4.管理机构和医师

        /// <summary>
        /// 健康档案管理机构名称
        /// </summary>
        public string ResponsibleOrganization { get; set; }
        /// <summary>
        /// 健康档案管理机构的组织机构代码
        /// </summary>
        // ReSharper disable once InconsistentNaming
        public string ResponsibleOrganizationID { get; set; }
        /// <summary>
        /// 责任医师姓名
        /// </summary>
        public string ResponsibleDoctor { get; set; }
        /// <summary>
        /// 责任意识电话
        /// </summary>
        public string ResponsibleDoctorPhone { get; set; }

        #endregion

        ///// <summary>
        ///// 健康事件
        ///// </summary>
        //public List<HealthEvent> HealthEvents { get; set; }

        ///// <summary>
        ///// 既往史
        ///// </summary>
        //public List<HealthHistory> HealthHistories { get; set; }

        ///// <summary>
        ///// 检查记录
        ///// </summary>
        //public List<Examine> Examines { get; set; }

        /// <summary>
        /// 建档日期
        /// </summary>
        public DateTime? ArchiveDate { get; set; }

        /// <summary>
        /// 健康档案来源 Dictionary.Code("HealthRecordSourceType")
        /// </summary>
        public string SourceType { get; set; }

        /// <summary>
        /// 备注
        /// </summary>
        public string Remark { get; set; }

    }
}
