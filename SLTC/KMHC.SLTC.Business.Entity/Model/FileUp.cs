namespace KMHC.SLTC.Business.Entity.Model
{
    using System;
    using System.Collections.Generic;

    public partial class FileUpModel
    {
        public string FileName { get; set; }
        public bool UpResult { get; set; }
        public string FilePath { get; set; }
        public string Reason { get; set; }
    }
}
