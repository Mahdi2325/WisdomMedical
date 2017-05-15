using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace KMHC.SLTC.Business.Entity.Base
{
    public class BaseResponse
    {
        public BaseResponse()
        {
            this.IsSuccess = true;
        }
        /// <summary>
        ///当前页
        /// </summary>
        public int CurrentPage { get; set; }

        /// <summary>
        /// 一共多少页
        /// </summary>
        public int PagesCount { get; set; }
        /// <summary>
        /// 一共多少条
        /// </summary>
        public int RecordsCount { get; set; }

        /// <summary>
        /// 返回信息
        /// </summary>
        public string ResultMessage { get; set; }
        /// <summary>
        /// 返回编码
        /// </summary>
        public int ResultCode { get; set; }
        /// <summary>
        /// 处理是否成功
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// 返回Token信息
        /// </summary>
        public string Token { get; set; }
    }

    public class BaseResponse<T> : BaseResponse
    {
        public T Data { get; set; }

        public BaseResponse()
        {
            this.IsSuccess = true;
        }

        public BaseResponse(T data)
        {
            this.Data = data;
        }
    }

    public class BaseSimpleResponse
    {
        /// <summary>
        /// 返回信息
        /// </summary>
        public string ResultMessage { get; set; }
        /// <summary>
        /// 返回编码
        /// </summary>
        public int ResultCode { get; set; }
        /// <summary>
        /// 处理是否成功
        /// </summary>
        public bool IsSuccess { get; set; }
        /// <summary>
        /// 返回Token信息
        /// </summary>
        public string Token { get; set; }
    }

    public class BaseSimpleResponse<T> : BaseSimpleResponse
    {
        public T Data { get; set; }

        public BaseSimpleResponse()
        {
            this.IsSuccess = true;
        }

        public BaseSimpleResponse(T data)
        {
            this.Data = data;
        }
    }
}
