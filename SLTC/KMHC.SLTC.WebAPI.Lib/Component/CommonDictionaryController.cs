using KM.Common;
using KMHC.SLTC.Business.Entity;
using KMHC.SLTC.Business.Entity.Base;
using KMHC.SLTC.Business.Entity.Filter;
using KMHC.SLTC.Business.Entity.Model;
using KMHC.SLTC.Business.Interface;
using KMHC.SLTC.WebAPI.Lib.Attribute;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Web.Http;

namespace KMHC.SLTC.WebAPI
{
    [RoutePrefix("api/CommonDictionary"), RoleBaseAuthorize]
    public class CommonDictionaryController : BaseApiController
    {
        IDictionaryItemService service = IOCContainer.Instance.Resolve<IDictionaryItemService>();

        [Route("")]
        public IHttpActionResult Post(BaseRequest<DictionaryItemFilter> request)
        {
            var response = new BaseResponse<IEnumerable>();
            if (request != null)
            {
                if (request.Data.ItemType != null)
                {
                    var itemTypes = request.Data.ItemType.Split(',');
                    if (itemTypes.Length > 1)
                    {
                        request.Data.ItemType = string.Empty;
                        request.Data.ItemTypes = itemTypes;
                    }
                }
                var dictionaryItemList = service.QueryDictionaryItem(request);
                response.Data = request.Data.ItemTypes
                    .ToDictionary(itemType => itemType, no => dictionaryItemList.Data.Where(m => m.ItemType == no)
                    .Select(m => new { m.ItemCode, m.ItemName }).ToList());
            }
            else
            {
                response.Data = new Dictionary<string, List<object>>();
            }
            return Ok(response);
        }
    }
}
