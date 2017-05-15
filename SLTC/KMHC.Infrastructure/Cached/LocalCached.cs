using System;
using System.Runtime.Caching;

namespace KMHC.Infrastructure.Cached
{
    /// <summary>
    /// <para>Copyright (C) 2015 康美健康云服务有限公司版权所有</para>
    /// <para>文 件 名： LocalCached.cs</para>
    /// <para>文件功能： netframework System.Runtime.Caching缓存，内容保存本服务器内存里。对常用且数据量少的变量可以采用本地缓存</para>
    /// <para>开发部门： 平台部</para>
    /// <para>创 建 人： lmf</para>
    /// <para>创建日期： 2015.9.25</para>
    /// <para>修 改 人： </para>
    /// <para>修改日期： </para>
    /// <para>备    注： </para>
    /// </summary>
    public class LocalCached : ICached
    {
        private readonly static MemoryCache Cached = MemoryCache.Default;
        public object Get(string key)
        {
           return Cached.Get(key);
        }

        public void Set(string key, object value)
        {
           Set(key, value, 60);
        }

        public void Set(string key, object value, int expiredMinute)
        {
            DateTimeOffset absoluteExpiration = DateTime.Now.AddMinutes(expiredMinute).ToUniversalTime();
            Cached.Set(key, value, absoluteExpiration);
        }

        public bool Remove(string key)
        {
           return Cached.Remove(key)!=null;
        }

        public void FlushAll()
        {
            Cached.Dispose();
        }

        public bool Exists(string key)
        {
            return Cached.Contains(key);
        }

        public bool Exists(string key, string valKey)
        {
            return this.Exists(string.Format("{0}__{1}", key, valKey));
        }

        public object Get(string key, string valKey)
        {
            return Cached.Get(string.Format("{0}__{1}", key, valKey));
        }

        public void Add(string key, string valKey, object value)
        {
            Cached.Set(string.Format("{0}__{1}", key, valKey), value, null);
        }

        public void Put(string key, string valKey, object value)
        {
            Cached.Set(string.Format("{0}__{1}", key, valKey), value, null);
        }
    }
}
