using System;

namespace KMHC.SLTC.Repository.Base
{
    public static class SqlFunctions
    {
        [System.Data.Entity.Core.Objects.DataClasses.EdmFunction("TWSLTCModel.Store", "DatePart")]
        public static int DatePart(string in_format, DateTime in_data)
        {
            throw new NotSupportedException("Direct calls are not supported.");
        }
    }
}