using System;
using System.Collections.Generic;
using System.Diagnostics.Contracts;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace HRDomain.Core
{
    public static class Check
    {
        public static void Assert(bool isTrue, string argumentName)
        {
#if DEBUG
            Contract.Assert(!isTrue, argumentName);
#endif
            if (isTrue)
            {
                throw new ArgumentNullException(argumentName);
            }
        }

        public static void IsNotNull(params object[] objects)
        {
            foreach (var o in objects)
            {
                Assert(o == null, string.Format("{0} is null", o.GetType().FullName));
            }
        }

        public static bool IsNull(params object[] objects)
        {
            return objects.Any(o => o == null);
        }
    }
}
