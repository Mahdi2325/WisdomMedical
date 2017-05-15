namespace KMHC.SLTC.WebAPI
{
    using KM.Common;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.WebAPI.Lib.Attribute;
    using System;
    using System.Collections.Generic;
    using System.Linq;
    using System.Web.Http;

    [RoutePrefix("api/DictionaryItem"), RoleBaseAuthorize]
    public class DictionaryItemController : BaseApiController
    {
        IDictionaryItemService service = IOCContainer.Instance.Resolve<IDictionaryItemService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query(int currentPage, int pageSize)
        {
            BaseRequest<DictionaryItemFilter> request = new BaseRequest<DictionaryItemFilter>();
            request.CurrentPage = currentPage;
            request.PageSize = pageSize;
            var response = service.QueryDictionaryItem(request);
            return Ok(response);
        }


        [Route(""), HttpGet]
        public IHttpActionResult Query(int dictionaryID)
        {
            BaseRequest<DictionaryFilter> request = new BaseRequest<DictionaryFilter>
            {
                PageSize = 0,
                Data = { DictionaryID = dictionaryID }
            };
            var response = service.GetDictionaryItems(request);
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(DictionaryItemModel baseRequest)
        {
            var response = service.SaveDictionaryItem(baseRequest);
            return Ok(response);
        }

        [Route("{id}")]
        public IHttpActionResult Delete(int id)
        {
            var response = service.DeleteDictionaryItem(id);
            return Ok(response);
        }
    }
}
