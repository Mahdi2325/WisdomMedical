
##########################菜篮子项目修改 start ################################
SET FOREIGN_KEY_CHECKS=0;
update DC_ChargeItem set CICategory=null;
ALTER TABLE `DC_ChargeItem`
MODIFY COLUMN `CICategory`  int(11) NULL DEFAULT NULL AFTER `CIName`,
ADD COLUMN `PhotoPath`  varchar(200) NULL AFTER `CIName`;

ALTER TABLE `DC_ServiceItemCategory`
ADD COLUMN `IsCommodity`  bit(1) NULL DEFAULT b'0' AFTER `SICName`;


CREATE TABLE `DC_OrderSerItChgIt` (
`OrderSerItChgItID`  int(11) NOT NULL AUTO_INCREMENT ,
`ServiceOrderID`  int(11) NOT NULL ,
`ChargeItemID`  int(11) NOT NULL ,
`CINo`  varchar(20) NULL ,
`CIName`  varchar(20) NULL ,
`PhotoPath`  varchar(200) NULL ,
`Unit`  varchar(20) NULL ,
`Price`  decimal(19,4) NULL ,
`Quantity`  int(11) NULL ,
`CreatedBy`  int(11) NOT NULL ,
`CreatedTime`  datetime NOT NULL ,
`ModifiedBy`  int(11) NOT NULL ,
`ModifiedTime`  datetime NOT NULL ,
`IsDeleted`  bit NOT NULL DEFAULT b'0' ,
PRIMARY KEY (`OrderSerItChgItID`)
)
;

ALTER TABLE `DC_ServiceOrder`
ADD COLUMN `Payment`  varchar(20) NULL AFTER `ServiceCity`,
ADD COLUMN `Delivery`  varchar(20) NULL AFTER `Payment`,
ADD COLUMN `PaymentStatus`  varchar(20) NULL AFTER `OrderStatus`,
ADD COLUMN `ContactName`  varchar(50) NULL AFTER `ServiceCity`,
ADD COLUMN `ContactPhone`  varchar(15) NULL AFTER `ContactName`;

ALTER TABLE `DC_Resident`
ADD COLUMN `IsVIP`  bit(1) NULL DEFAULT NULL COMMENT '是否为会员' AFTER `ModifiedTime`;

CREATE TABLE `DC_GroupActivityCategory` (
`ID`  int(11) NOT NULL AUTO_INCREMENT COMMENT 'CATEGORYID' ,
`CategoryName`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '列别名称' ,
`Remark`  varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '备注' ,
`CreateBy`  int(11) NULL DEFAULT NULL ,
`CreateTime`  datetime NULL DEFAULT NULL ,
`OrganizationID`  int(11) NULL DEFAULT NULL COMMENT '公司名称' ,
`IsDeleted`  bit(1) NULL DEFAULT NULL COMMENT '是否删除' ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_GroupActivityItem` (
`ID`  int(11) NOT NULL AUTO_INCREMENT COMMENT 'GROUPACTIVITY ITEMID' ,
`GroupActivityCategoryID`  int(11) NULL DEFAULT NULL COMMENT '类别 GroupActivityCategory 外键' ,
`ItemName`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '活动项目名称' ,
`Remark`  varchar(200) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '备注' ,
`CreateBy`  int(11) NULL DEFAULT NULL ,
`CreateTime`  datetime NULL DEFAULT NULL ,
`IsDelete`  bit(1) NULL DEFAULT NULL COMMENT '是否删除' ,
PRIMARY KEY (`ID`),
CONSTRAINT `G1` FOREIGN KEY (`GroupActivityCategoryID`) REFERENCES `DC_GroupActivityCategory` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `G1` (`GroupActivityCategoryID`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_GroupActivityRecord` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`CategoryID`  int(11) NULL DEFAULT NULL COMMENT '类别' ,
`ItemID`  int(11) NULL DEFAULT NULL COMMENT '项目ID' ,
`ActivityName`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '活动名称主题' ,
`ActivityContent`  varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`ActivityPlace`  varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '活动地点' ,
`StartTime`  datetime NULL DEFAULT NULL COMMENT '活动开始时间' ,
`Hours`  decimal(6,2) NULL DEFAULT NULL COMMENT '活动小时数' ,
`EndTime`  datetime NULL DEFAULT NULL COMMENT '活动结束时间' ,
`EmployeeIDs`  varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '志愿者ID 逗号分隔' ,
`EmployeeNames`  varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '员工姓名集 ' ,
`MemberIDs`  varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '会员以及被服务者ID集合 逗号分隔' ,
`MemberNames`  varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL COMMENT '被服务人员姓名集' ,
`OrganizationID`  int(11) NULL DEFAULT NULL COMMENT '机构代码' ,
PRIMARY KEY (`ID`),
CONSTRAINT `G3` FOREIGN KEY (`CategoryID`) REFERENCES `DC_GroupActivityCategory` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
CONSTRAINT `G4` FOREIGN KEY (`ItemID`) REFERENCES `DC_GroupActivityItem` (`ID`) ON DELETE RESTRICT ON UPDATE RESTRICT,
INDEX `G3` (`CategoryID`) USING BTREE ,
INDEX `G4` (`ItemID`) USING BTREE 
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;


SET FOREIGN_KEY_CHECKS=1;
##########################菜篮子项目修改 end################################

##########################字典修改 start################################
insert into SYS_Dictionary(DictionaryID,
ItemType,
TypeName,
ModifyFlag,
Description,
CreatedBy,
CreatedTime,
ModifiedBy,
ModifiedTime,
IsDeleted)
values (35,'P00.005','商品付款状态',null,'菜篮子等商品类订单的付款状态',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(36,'P00.006','商品支付方式',null,'商品支付方式',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(37,'P00.007','商品送货方式',null,'商品送货方式',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false)
;

update SYS_DictionaryItem set itemcode='Undelivered',itemname='未发货',Description='未发货' where DictionaryItemID=192;

insert into SYS_DictionaryItem
(
DictionaryID,
ItemCode,
ItemName,
OrderSeq,
Description,
CreatedBy,
CreatedTime,
ModifiedBy,
ModifiedTime,
IsDeleted)
values
(34,'Delivered','已发货',2,'已发货',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(34,'Finish','已完成',3,'已完成',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(35,'Unpaid','未付款',0,'未付款',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(35,'Paid','已付款',1,'已付款',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(36,'Cash','现金支付',0,'现金支付',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(37,'HomeDelivery','送货上门',0,'送货上门',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false),
(37,'SelfPickup','自提',1,'自提',0,'2016-11-18 10:47:12',0,'2016-11-18 10:47:12',false);

##########################字典修改 end################################

##################################
ALTER TABLE `DC_GroupActivityRecord`
ADD COLUMN `OtherPersons`  varchar(500) NULL AFTER `MemberNames`,
ADD COLUMN `EmployeeCount`  int(11) NULL AFTER `EmployeeNames`,
ADD COLUMN `MemberCount`  int(11) NULL AFTER `MemberNames`,
ADD COLUMN `OtherCount`  int(11) NULL AFTER `OtherPersons`,
ADD COLUMN `AreaID`  int(11) NULL AFTER `OtherCount`;


ALTER TABLE `ORG_Organization`
ADD COLUMN `LogoPath`  varchar(200) NULL AFTER `Address`;

DROP TABLE IF EXISTS `DC_RefundRecord`;

CREATE TABLE `DC_RefundRecord` (
  `ID` int(11) NOT NULL,
  `ServiceOrderID` int(11) NOT NULL,
  `Reason` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `Fund` decimal(19,4) DEFAULT NULL,
  `IsAudit` bit(1) DEFAULT NULL,
  `Reply` varchar(500) COLLATE utf8_bin DEFAULT NULL,
  `CreateBy` int(11) DEFAULT NULL,
  `CreateTime` datetime DEFAULT NULL,
  `ModifiedBy` int(11) DEFAULT NULL,
  `ModifiedTime` datetime DEFAULT NULL,
  PRIMARY KEY (`ID`),
  KEY `ServiceOrderID` (`ServiceOrderID`),
  CONSTRAINT `ServiceOrderID` FOREIGN KEY (`ServiceOrderID`) REFERENCES `DC_ServiceOrder` (`ServiceOrderID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_bin;

#######################################################################
ALTER TABLE `DC_FeeDetail`
ADD COLUMN `TotalPrice`  decimal(19,4) NULL AFTER `Quantity`;

ALTER TABLE `DC_GroupActivityRecord`
ADD COLUMN `CreateFromID`  int(11) NULL AFTER `OrganizationID`;

ALTER TABLE `DC_ChargeItem`
ADD COLUMN `Description`  text NULL AFTER `Price`;

ALTER TABLE `DC_Person` MODIFY COLUMN `ContactName1`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `Phone`;
ALTER TABLE `DC_Person` MODIFY COLUMN `ContactPhone1`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL AFTER `ContactName1`;

CREATE TABLE `DC_CallInfo` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`CallDate`  datetime NULL DEFAULT NULL ,
`CallCatagory`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`CallType`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`ReferralOrg`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Status`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Result`  varchar(1000) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;


CREATE TABLE `DC_Contract` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`ContractNo`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NOT NULL ,
`ContractValue`  decimal(20,4) NULL DEFAULT NULL ,
`DiscountInfo`  varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`FinalValue`  decimal(20,4) NULL DEFAULT NULL ,
`StartTime`  datetime NULL DEFAULT NULL ,
`EndTime`  datetime NULL DEFAULT NULL ,
`ServiceType`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`ContractForm`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`CaseNature`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Description`  text CHARACTER SET utf8 COLLATE utf8_bin NULL ,
`ContractFile`  varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`ReservedOperator`  int(11) NULL DEFAULT NULL ,
`CreatedBy`  int(11) NULL DEFAULT 0 ,
`CreatedTime`  datetime NULL DEFAULT NULL ,
`ModifiedBy`  int(11) NULL DEFAULT 0 ,
`ModifiedTime`  datetime NULL DEFAULT NULL ,
`IsDeleted`  bit(1) NOT NULL DEFAULT b'0' ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_Device` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`DeviceType`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`DeviceName`  varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`DeviceNo`  varchar(50) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_DispathTaskRecord` (
`ID`  int(255) NOT NULL AUTO_INCREMENT ,
`EmployeeID`  varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`WorkTime`  date NULL DEFAULT NULL ,
`ClientName`  varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`OrderID`  varchar(255) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_Family` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`Relation`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Name`  varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`IsEmerg`  bit(1) NULL DEFAULT NULL ,
`Tell`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Phone`  varchar(20) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`HasKey`  bit(1) NULL DEFAULT NULL ,
`Location`  varchar(100) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;


CREATE TABLE `DC_Habit` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`HabitType`  varchar(10) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Content`  varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
`Remarks`  text CHARACTER SET utf8 COLLATE utf8_bin NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

CREATE TABLE `DC_PriorityRemark` (
`ID`  int(11) NOT NULL AUTO_INCREMENT ,
`PersonID`  int(11) NOT NULL ,
`Remarks`  varchar(500) CHARACTER SET utf8 COLLATE utf8_bin NULL DEFAULT NULL ,
PRIMARY KEY (`ID`)
)
ENGINE=InnoDB
DEFAULT CHARACTER SET=utf8 COLLATE=utf8_bin
ROW_FORMAT=Compact
;

#############################################################

