namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class CommodityTypeModel
    {
        public int CTypeID { get; set; }
        public int OrganizationID { get; set; }
        public string CTypeName { get; set; }
        public string Remark { get; set; }
        public int? OrderBy { get; set; }
        public bool IsDeleted { get; set; }
    }
}
