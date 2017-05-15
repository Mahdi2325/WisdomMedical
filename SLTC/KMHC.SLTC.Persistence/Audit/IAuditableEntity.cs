using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Persistence.Audit
{
    public interface IAuditableEntity
    {
        int CreatedBy { get; set; }

        DateTime CreatedTime { get; set; }

        int ModifiedBy { get; set; }

        System.DateTime ModifiedTime { get; set; }

        bool IsDeleted { get; set; }

    }
}
