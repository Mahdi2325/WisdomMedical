namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;
    
    public partial class ServiceItemCategoryModel
    {
        public int ServiceItemCategoryID { get; set; }
        public int OrganizationID { get; set; }
        public string SICNo { get; set; }
        public string SICName { get; set; }
        public string Remark { get; set; }
        public Nullable<int> CreatedBy { get; set; }
        public Nullable<System.DateTime> CreatedTime { get; set; }
        public Nullable<int> ModifiedBy { get; set; }
        public Nullable<System.DateTime> ModifiedTime { get; set; }
        public bool IsDeleted { get; set; }
        public IList<ServiceItemModel> ServiceItems { get; set; }
    }
}
