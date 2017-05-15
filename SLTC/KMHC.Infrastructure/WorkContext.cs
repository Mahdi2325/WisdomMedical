using KMHC.Infrastructure.Security;
using System;
using System.Collections.Concurrent;
using System.Web;

namespace KMHC.Infrastructure
{
    /// <summary>
    /// A work context for work context scope
    /// </summary>
    public class WorkContext {

        private readonly ConcurrentDictionary<string, object> _stateResolvers = new ConcurrentDictionary<string, object>();

        private T GetState<T>(string name)
        {
            var resolver = _stateResolvers.GetOrAdd(name, default(T));
            return (T)resolver;
        }
        private void SetState<T>(string name, T value)
        {
            _stateResolvers[name] = value;
        }

        /// <summary>
        /// The http context corresponding to the work context
        /// </summary>
        public HttpContextBase HttpContext
        {
            get { return GetState<HttpContextBase>("HttpContext"); }
            set { SetState("HttpContext", value); }
        }

        /// <summary>
        /// The Layout shape corresponding to the work context
        /// </summary>
        public dynamic Layout
        {
            get { return GetState<dynamic>("Layout"); }
            set { SetState("Layout", value); }
        }

        /// <summary>
        /// The user, if there is any corresponding to the work context
        /// </summary>
        public ICustomPrincipal CurrentUser
        {
            get { return GetState<ICustomPrincipal>("CurrentUser"); }
            set { SetState("CurrentUser", value); }
        }

        /// <summary>
        /// The theme used in the work context
        /// </summary>
        //public ExtensionDescriptor CurrentTheme {
        //    get { return GetState<ExtensionDescriptor>("CurrentTheme"); }
        //    set { SetState("CurrentTheme", value); }
        //}

        /// <summary>
        /// Active culture of the work context
        /// </summary>
        public string CurrentCulture
        {
            get { return GetState<string>("CurrentCulture"); }
            set { SetState("CurrentCulture", value); }
        }

        /// <summary>
        /// Time zone of the work context
        /// </summary>
        public TimeZoneInfo CurrentTimeZone
        {
            get { return GetState<TimeZoneInfo>("CurrentTimeZone"); }
            set { SetState("CurrentTimeZone", value); }
        }
    }
}
