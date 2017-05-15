using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Linq;
using System.Web;

namespace KMHC.SLTC.Business.Entity
{
    public enum EnumApiResponseStatus
    {
        Unauthorized = -2,
        ExceptionHappened = -1,
        Success = 0
    }

    /// <summary>
    /// 编码键
    /// </summary>
    public enum EnumCodeKey
    {
        ServiceOrder,
        SerOrdSerIt,
        OrderSerItChgIt,
        ServiceItem,
        Bill,
        ServiceOrderCode,
        ServiceItemCategoryCode,
        ServiceGroupCode,
        ServiceItemCode,
        GroupCode,
        OrgCode,
        AreaCode,
        ChargeItemCode,
        EmployeeCode,
        DepositCode,
        PaymentCode,
        FeeDetailCode,
        TaskCode,
        BillCode,
        RoleCode,
        ResidentCode,
        PersonCode,
        ContractCode,
        DeviceCode,
        CommodityItemCode,
        ResidentServicePan,
        DeptCode
    }

    /// <summary>
    /// 编码规则
    /// </summary>
    public enum EnumCodeRule
    {
        None,
        Year,
        YearMonth,
        YearMonthDay
    }

    /// <summary>
    /// 固定資費週期
    /// </summary>
    public enum EnumPeriod
    {
        Day,
        Month
    }

    public enum EnumBillState
    {
        /// <summary>
        /// 新產生賬單
        /// </summary>
        Open,
        /// <summary>
        /// 關賬
        /// </summary>
        Close,
        /// <summary>
        /// 取消
        /// </summary>
        Cancel
    }

    /// <summary>
    /// 角色類型 
    /// SuperAdmin 是預製的 
    /// Admin類型的Role在機構維護界面生成，一個機構只有一個Admin類型Role，調用SuperAdmin類型Role作為模板，生成相應的數據，保存時取消的構選的模塊要同步該機構的所有Role
    /// Normal類型的Role在角色維護界面生成，一個機構可以有多個Normal類型Role
    /// </summary>
    public enum EnumRoleType
    {
        SuperAdmin,
        Admin,
        Normal
    }

    public enum MajorType
    {
        社工照顧計劃 = 1,
        護理照顧計劃 = 2
    }

    //用户关系类型
    public enum UserRelationType
    {
        UserEmployee = 2,//用户 员工
    }

    /// <summary>
    /// 缴费类型
    /// </summary>
    public enum PayType
    {
        Pay,//预存支付
        Bill//账单
    }

    /// <summary>
    /// 服务和商品付款状态
    /// </summary>
    public enum PaymentStatus
    {
        [Description("Unpaid")]
        Unpaid,//未付款

        [Description("Paid")]
        Paid //已付款
    }

    /// <summary>
    /// 服务和商品定单状态
    /// </summary>
    public enum OrderStatus
    {
        [Description("Wait")]
        Wait,//等待

        [Description("Undelivered")]
        Undelivered, // 未发货

        [Description("Delivered")]
        Delivered,//已发货

        [Description("Finish")]
        Finish //完成
    }

    /// <summary>
    /// 工单状态
    /// </summary>
    public enum TaskStatus
    {
        [Description("Wait")]
        Wait, //没有分配

        [Description("Assign")]
        Assign, //已经分配

        [Description("Execution")]
        Execution, //正在执行

        [Description("Finish")]
        Finish //完成
    }

    /// <summary>
    /// 工单状态
    /// </summary>
    public enum JobTitleType
    {
        AdministrativeStaff = 6121, //行政人员
        Servicepersonal = 6124, //服务人员
        Other = 6126 //其他
    }

    /// <summary>
    /// 商品支付方式
    /// </summary>
    public enum Payment
    {
        [Description("Cash")]
        Cash, //现金支付

        [Description("ResidentCard")]
        ResidentCard //会员卡支付
    }

    /// <summary>
    /// 商品送货方式
    /// </summary>
    public enum Delivery
    {
        [Description("HomeDelivery")]
        HomeDelivery, //送货上门
        [Description("SelfPickup")]
        SelfPickup //自提
    }

    /// <summary>
    /// 登录用户类别
    /// </summary>
    public enum UserType
    {
        Resident, //送货上门
        Employee //自提
    }

    /// <summary>
    /// 角色类型
    /// </summary>
    public enum RoleType
    {
        TollCollector, //收费员
        MedicalPerson, //医疗服务人员
        ServicePerson, //派遣服务人员
        Other //其他
    }

    /// <summary>
    /// 退款状态
    /// </summary>
    public enum RefundStatus
    {
        [Description("Wait")]
        Wait, //等待审核
        [Description("Agree")]
        Agree, //同意
        [Description("Disagree")]
        Disagree //不同意
    }

    /// <summary>
    /// 会员等级
    /// </summary>
    public enum ResidentType
    {
        Signed, //签约会员
        Unsigned //非签约会员
    }
    /// <summary>
    /// 预约模式
    /// </summary>
    public enum OrderMode
    {
        ByNum, //按此预约
        ByTime //按时预约
    }

    /// <summary>
    /// 订单类型
    /// </summary>
    public enum OrderType
    {
        Service, //服务订单
        Commodity, //商品订单
        Group //套餐订单
    }

    /// <summary>
    /// 设备类型
    /// </summary>
    public enum DeviceType
    {
        Watch, //智能手表
        WristBands, //智能手环
        CallEquipment //呼叫设备
    }

    /// <summary>
    /// 订单来源
    /// </summary>
    public enum OrderFrom
    {
        [Description("Web")]
        Web, //网站
        [Description("App")]
        App //App
    }

    /// <summary>
    /// 服务类别
    /// </summary>
    public enum ServiceType
    {
        HomeCare=1,      //居家服务
        ServiceStation=2 //服务中心
    }

    /// <summary>
    /// 项目，商品或套餐的启用/禁用状态
    /// </summary>
    public enum ServiceStatus
    {
        Enable,      //居家服务
        Disable      //服务中心
    }

    public enum CheckStatus
    {
        Register = 1,
        WaitForCheck = 2,
        InChecking = 3,
        Expired = 4,
        Finish = 5,
        Cancel = 6,
        GiveUp = 7
    }

    /// <summary>
    /// 预约状态
    /// </summary>
    public enum AppointmentStatus
    {
        Wait,      //待处理
        Ordered,   //已下单
        Canceled   //已取消
    }


    /// <summary>
    /// 收费状态
    /// </summary>
    public enum ChargeStatus
    {
        Unpaid=0,      //订单生成
        Paid=1,          //收费
        Refund=2         //退费
    }
}