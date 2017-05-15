using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Model
{
    public class WebBaseResponse
    {
        public string errorCode { get; set; }
        public string msg { get; set; }
    }
    public class WebResponse<T> : WebBaseResponse
    {
        public T content { get; set; }

        public WebResponse()
        {
        }
        public WebResponse(T content)
        {
            this.content = content;
        }
    }

    public class PressureContent
    {
        public List<Pressure> list { get; set; }
    }
    public class BloodSugarContent
    {
        public List<BloodSugar> list { get; set; }
    }
    public class BloodOxygenContent
    {
        public List<HeartRate> list { get; set; }
    }
    public class WatchContent
    {
        public List<Watch> list { get; set; }
    }
    public class ExamRecordContent
    {
        public List<ExamRecord> list { get; set; }
    }

    /// <summary>
    /// 血压
    /// </summary>
    public class Pressure
    {
        public long? Sno { get; set; }
        public string IMEI { get; set; }
        public int? TypeId { get; set; }
        /// <summary>
        /// 测量时间 timestamp
        /// </summary>
        public string BPTime { get; set; }
        /// <summary>
        /// 量测时间 字符串
        /// </summary>
        public string MeasureTime { get; set; }
        public int? HPressure { get; set; }
        public int? LPressure { get; set; }
        /// <summary>
        /// 脉搏
        /// </summary>
        public int? Puls { get; set; }
        public string CreateDate { get; set; }

    }
    /// <summary>
    /// 血糖
    /// </summary>
    public class BloodSugar
    {
        public long? Sno { get; set; }
        public string IMEI { get; set; }
        public int? TypeId { get; set; }
        /// <summary>
        /// 测量时间
        /// </summary>
        public string BSTime { get; set; }
        /// <summary>
        /// 量测时间 字符串
        /// </summary>
        public string MeasureTime { get; set; }
        /// <summary>
        /// 血糖值
        /// </summary>
        public int? Glu { get; set; }
        public string CreateDate { get; set; }
    }
    /// <summary>
    /// 心率
    /// </summary>
    public class HeartRate
    {
        public long? Sno { get; set; }
        public string IMEI { get; set; }
        public int? TypeId { get; set; }
        /// <summary>
        /// 测量时间 timestamp
        /// </summary>
        public string BSTime { get; set; }
        /// <summary>
        /// 量测时间 字符串
        /// </summary>
        public string MeasureTime { get; set; }
        /// <summary>
        /// 心率
        /// </summary>
        public int? heartRate { get; set; }
        public string CreateDate { get; set; }
    }
    /// <summary>
    /// 手表信息
    /// </summary>
    public class Watch
    {
        public string imei { get; set; }
        public string realName { get; set; }
        public string phone { get; set; }
       
    }
    /// <summary>
    /// 体检记录信息
    /// </summary>
    public class ExamRecord
    {
        public int? ExamId { get; set; }
        public int? PersonId { get; set; }
        public string ExamNo { get; set; }
        public string ExamDate { get; set; }
        public string ExamType { get; set; }
        public string VisitWay { get; set; }
        public string Doctor { get; set; }
        public string CreateDate { get; set; }
        public string CreateBy { get; set; }
        public string UpdateDate { get; set; }
        public string UpdateBy { get; set; }
        public int? Status { get; set; }

    }
    public class Examresult
    {
        public int? ResultId { get; set; }
        public int? ExamId { get; set; }
        public string PersonNo { get; set; }
        public string ItemCode { get; set; }
        public string Name { get; set; }
        public string Result { get; set; }
        public string CreateDate { get; set; }
        public int? ItemId { get; set; }

    }
    public class PersonFile
    {
        public int? PersonId { get; set; }
        public string PersonNo { get; set; }
        public string RecordNo { get; set; }
        public string Name { get; set; }
        public string Gender { get; set; }
        public string BirthDate { get; set; }
        public string Country { get; set; }
        public string Nationality { get; set; }
        public string MarriageStatus { get; set; }
        public string IDType { get; set; }
        public string IDNumber { get; set; }
        public string Phone { get; set; }
        public string ContactName { get; set; }
        public string ContactPhone { get; set; }
        public string EmailAddress { get; set; }
        public string CensusRegisterFlag { get; set; }
        public string CensusAddressCode { get; set; }
        public string CensusAddressName { get; set; }
        public string CensusPostCode { get; set; }
        public string CurrentAddressCode { get; set; }
        public string CurrentAddressName { get; set; }
        public string CurrentPostCode { get; set; }
        public string Company { get; set; }
        public string HireDate { get; set; }
        public string OccupationClass { get; set; }
        public string EducationLevel { get; set; }
        public string InsuranceType { get; set; }
        public string InsuranceTypeName { get; set; }
        public string PayMethod { get; set; }
        public string ABOType { get; set; }
        public string RHType { get; set; }
        public string AllergyHistory { get; set; }
        public string RiskFactors { get; set; }
        public string DisabilityStatus { get; set; }
        public string Community { get; set; }
        public string CommunityContact { get; set; }
        public string CommunityContactPhone { get; set; }
        public string ResponsibleOrganization { get; set; }
        public string ResponsibleOrganizationID { get; set; }
        public string ResponsibleDoctor { get; set; }
        public string ResponsibleDoctorPhone { get; set; }
        public string ArchiveDate { get; set; }
        public string ImgUrl { get; set; }

    }
    public class WebExamRecordResponse
    {
        public int Status { get; set; }
        public string Msg { get; set; }
        public int PagesCount { get; set; }
        public List<ExamRecord> Data { get; set; }
    }
    public class WebExamResultResponse
    {
        public int Status { get; set; }
        public string Msg { get; set; }
        public int PagesCount { get; set; }
        public List<Examresult> Data { get; set; }
    }
    public class WebPersonFileResponse
    {
        public int Status { get; set; }
        public string Msg { get; set; }
        public int PagesCount { get; set; }
        public PersonFile Data { get; set; }
    }
}
