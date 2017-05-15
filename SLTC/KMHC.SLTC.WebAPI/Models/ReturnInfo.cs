using System;
using System.Collections.Generic;
using System.Linq;
using System.Runtime.Serialization;
using System.Web;

namespace KMHC.SLTC.WebAPI.Models
{
    [DataContract]
    public sealed class ReturnInfo<T>
    {
        public ReturnInfo()
        {
            ReturnMessage = "";
            IsSuccess = false;
            ReturnData = default(T);
        }

        /// <summary>
        /// 返回值的类型
        /// </summary>
        [DataMember]
        public T ReturnData { set; get; }

        /// <summary>
        /// 返回信息
        /// </summary>
        [DataMember]
        public string ReturnMessage
        {
            set;
            get;
        }

        /// <summary>
        /// 表示是否成功
        /// </summary>
        [DataMember]
        public bool IsSuccess { set; get; }

        /// <summary>
        /// 设置错误的返回信息，自动设置IsSuccess为False
        /// </summary>
        public void SetError(string message = "服务调用失败")
        {
            IsSuccess = false;
            ReturnMessage = message;
        }

        /// <summary>
        /// 设置成功的返回信息,自动设置IsSuccess为True
        /// </summary>
        public void SetSuccess(string message = "操作成功")
        {
            IsSuccess = true;
            ReturnMessage = message;
        }

        /// <summary>
        /// 设置成功的返回数据，自动设置IsSuccess为True和ReturnMessage为“操作成功”
        /// </summary>
        public void SetSuccess(T returnData, string message = "操作成功")
        {
            IsSuccess = true;
            ReturnMessage = message;
            ReturnData = returnData;
        }

        /// <summary>
        ///设置和构建返回数据 
        /// </summary>
        public ReturnInfo<T> SetResponse(T returnData, Object response, string message = "操作成功")
        {
            var returnedData = (response as BaseResponse) ?? new BaseResponse() { IsSuccess = false };
            IsSuccess = returnedData.IsSuccess;
            ReturnMessage = returnedData.MessageContent;
            ReturnData = returnData;
            return this;
        }


        [Serializable]
        public class BaseResponse
        {

            public bool IsSuccess { get; set; }
            public string MessageCode { get; set; }
            public string MessageContent { get; set; }
        }
    }
}