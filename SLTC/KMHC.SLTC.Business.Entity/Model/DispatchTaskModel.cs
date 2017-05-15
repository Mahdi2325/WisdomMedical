namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class DispatchModel
    {
        public int EmployeeID { get; set; }
        public string EmpName { get; set; }
        public List<DispathTaskModel> DispatchTaskList { get; set; }
    }

    public partial class DispathTaskModel
    {
        public System.DateTime WorkDate { get; set; }
        public List<DispathTaskRecordModel> DispatchRecordList { get; set; }
    }

    public partial class DispathTaskRecordModel
    {
        private DateTime _workTime;
        public int EmployeeID { get; set; }
        public int SplitTag { get; set; }
        public System.DateTime WorkTime {
            get { return _workTime; }
            set
            {
                _workTime = value;
                SplitTag = 0;
                if (_workTime != null && _workTime.Hour >=13d)
                {
                    SplitTag = 1;
                }
            }  
        }
        public string ClientName { get; set; }
        public int OrderID { get; set; }
    }
}
