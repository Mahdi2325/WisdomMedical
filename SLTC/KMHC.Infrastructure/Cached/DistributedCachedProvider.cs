

namespace KMHC.Infrastructure.Cached
{
    /// <summary>
    /// <para>Copyright (C) 2015 康美健康云服务有限公司版权所有</para>
    /// <para>文 件 名： DistributedCachedProvider.cs</para>
    /// <para>文件功能： 分布式缓存提供者</para>
    /// <para>开发部门： 平台部</para>
    /// <para>创 建 人： lmf</para>
    /// <para>创建日期： 2015.9.25</para>
    /// <para>修 改 人： </para>
    /// <para>修改日期： </para>
    /// <para>备    注： </para>
    /// </summary>
    public  class   DistributedCachedProvider
    {
        private static ICached instance;
        private DistributedCachedProvider() { }

        private static readonly object LockObj=new object();

        public static ICached Instance
        {
            get
            {
                if (instance == null)
                {
                    lock (LockObj)
                    {
                        if (instance == null)
                        {
                            instance = new DistributedCached();
                        }
                    }
                }
                return instance;
            }
        }
    }
}
