namespace KMHC.Infrastructure.Cached
{
    /// <summary>
    /// <para>Copyright (C) 2015 康美健康云服务有限公司版权所有</para>
    /// <para>文 件 名： ICached.cs</para>
    /// <para>文件功能： 缓存接口</para>
    /// <para>开发部门： 平台部</para>
    /// <para>创 建 人： lmf</para>
    /// <para>创建日期： 2015.9.25</para>
    /// <para>修 改 人： </para>
    /// <para>修改日期： </para>
    /// <para>备    注： </para>
    /// </summary>
    public interface ICached
    {
        /// <summary>
        ///  按key从缓存读取对象
        /// </summary>
        /// <param name="key">key</param>
        /// <returns>对象</returns>
        object Get(string key);
        /// <summary>
        /// 新增，更新key的值到缓存
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <returns></returns>
        void Set(string key, object value);
        /// <summary>
        /// 新增，更新key的值到缓存
        /// </summary>
        /// <param name="key"></param>
        /// <param name="value"></param>
        /// <param name="expiredMinute">过期时间，单位是分钟</param>
        /// <returns></returns>
        void Set(string key, object value, int expiredMinute);
        /// <summary>
        /// 从缓存中删除对象
        /// </summary>
        /// <param name="key"></param>
        /// <returns></returns>
        bool Remove(string key);
        /// <summary>
        /// 清除所有缓存
        /// </summary>
        void FlushAll();
        /// <summary>
        /// 是否存在
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="valKey">對象</param>
        /// <returns>true/false</returns>
        bool Exists(string key);
        /// <summary>
        /// 是否存在
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="valKey">參數key</param>
        /// <returns>true/false</returns>
        bool Exists(string key, string valKey);
        /// <summary>
        /// 獲取對象
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="valKey">參數key</param>
        /// <returns>對象</returns>
        object Get(string key, string valKey);
        /// <summary>
        /// 添加對象
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="valKey">參數key</param>
        /// <param name="value">對象</param>
        void Add(string key, string valKey, object value);
        /// <summary>
        /// 添加或替換對象
        /// </summary>
        /// <param name="key">key</param>
        /// <param name="valKey">參數key</param>
        /// <param name="value">對象</param>
        void Put(string key, string valKey, object value);
    }
}
