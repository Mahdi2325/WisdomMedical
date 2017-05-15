using System;
using Enyim.Caching;
using Enyim.Caching.Memcached;

namespace KMHC.Infrastructure.Cached
{    /// <summary>
    /// <para>Copyright (C) 2015 康美健康云服务有限公司版权所有</para>
    /// <para>文 件 名： DistributedCached.cs</para>
    /// <para>文件功能： memcached缓存是分布式内存级缓存，支持水平扩展。在大并量情况下进行缓存，可以减轻数据库压力，提高性能。注意key的长度限制250字母，value的大小不能超过1M。</para>
    /// <para>开发部门： 平台部</para>
    /// <para>创 建 人： lmf</para>
    /// <para>创建日期： 2015.9.25</para>
    /// <para>修 改 人： </para>
    /// <para>修改日期： </para>
    /// <para>备    注： </para>
    /// </summary>
    public class DistributedCached : ICached
    {
        private readonly static MemcachedClient Cached = new MemcachedClient();
        public object Get(string key)
        {
            return Cached.Get(key);
        }
        
        public void Set(string key, object value)
        {
            Cached.Store(StoreMode.Set, key, value, DateTime.MaxValue);
        }

        public void Set(string key, object value, int expiredMinute)
        {
            //DateTime.Now.AddMinutes(expiredMinute)
            Cached.Store(StoreMode.Set, key, value,DateTime.MaxValue);
        }

        public bool Remove(string key)
        {
            return Cached.Remove(key);
        }

        public void FlushAll()
        {
            Cached.FlushAll();
        }

        public bool Exists(string key)
        {
            object obj;
            return Cached. TryGet(key, out obj);
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
            Cached.Store(StoreMode.Set, string.Format("{0}__{1}", key, valKey), value, DateTime.MaxValue);
        }

        public void Put(string key, string valKey, object value)
        {
            Cached.Store(StoreMode.Set, string.Format("{0}__{1}", key, valKey), value, DateTime.MaxValue);
        }
    }
}
