using KMHC.Infrastructure;

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

    [RoutePrefix("api/Persons"), RoleBaseAuthorize]
    public class PersonController : BaseApiController
    {
        IPersonService service = IOCContainer.Instance.Resolve<IPersonService>();

        [Route(""), HttpGet]
        public IHttpActionResult Query([FromUri]BaseRequest<PersonFilter> request)
        {
            var response = service.QueryPerson(request);
            return Ok(response);
        }

        [Route("{personID}")]
        public IHttpActionResult Get(int personID)
        {
            var response = service.GetPerson(personID);
            IResidentService residentService = IOCContainer.Instance.Resolve<IResidentService>();
            var request = new BaseRequest<ResidentFilter>();
            request.Data.PersonId = personID;
            var residentList = residentService.QueryResident(request);
            if( residentList.Data.Count > 0){
                response.Data.ResidentID = residentList.Data[0].ResidentID;
                response.Data.QrPath = Constants.QrCodePath + residentList.Data[0].ResidentID.ToString() + ".png";
            }
            return Ok(response);
        }

        [Route("")]
        public IHttpActionResult Post(PersonModel baseRequest)
        {
            baseRequest.OrganizationID = SecurityHelper.CurrentPrincipal.OrgId;
            var response = service.SavePerson(baseRequest);
            return Ok(response);
        }

        [Route("{personID}")]
        public IHttpActionResult Delete(int personID)
        {
            var response = service.DeletePerson(personID);
            return Ok(response);
        }
    }
}
