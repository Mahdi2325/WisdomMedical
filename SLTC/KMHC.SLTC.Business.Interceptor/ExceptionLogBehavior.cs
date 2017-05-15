/*
创建人: 肖国栋
创建日期:2016-03-14
说明:錯誤日誌攔截器
*/
namespace KMHC.SLTC.Business.Interceptor
{
    using System;
    using System.Collections.Generic;
    using Microsoft.Practices.Unity.InterceptionExtension;
    public class ExceptionLogBehavior : IInterceptionBehavior
    {
        /// <summary>
        /// 获取当前行为需要拦截的对象类型接口。
        /// </summary>
        /// <returns>所有需要拦截的对象类型接口。</returns>
        public IEnumerable<Type> GetRequiredInterfaces()
        {
            return Type.EmptyTypes;
        }
        /// <summary>
        /// 通过实现此方法来拦截调用并执行所需的拦截行为。
        /// </summary>
        /// <param name="input">调用拦截目标时的输入信息。</param>
        /// <param name="getNext">通过行为链来获取下一个拦截行为的委托。</param>
        /// <returns>从拦截目标获得的返回信息。</returns>
        public IMethodReturn Invoke(IMethodInvocation input, GetNextInterceptionBehaviorDelegate getNext)
        {
            IMethodReturn retvalue = getNext()(input, getNext);
            if (retvalue.Exception != null)
            {
                //记录异常的内容 比如Log4Net等
                KM.Common.LogHelper.WriteError(retvalue.Exception.ToString());
#if !DEBUG 
                retvalue.Exception = null;
#endif
            }
            return retvalue;
        }

        /// <summary>
        /// 获取一个<see cref="Boolean"/>值，该值表示当前拦截行为被调用时，是否真的需要执行
        /// 某些操作。
        /// </summary>
        public bool WillExecute
        {
            get { return true; }
        }
    }

}
