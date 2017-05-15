namespace KMHC.SLTC.Business.Implement
{
    using AutoMapper;
    using KMHC.SLTC.Business.Entity;
    using KMHC.SLTC.Business.Entity.Base;
    using KMHC.SLTC.Business.Entity.Filter;
    using KMHC.SLTC.Business.Entity.Model;
    using KMHC.SLTC.Business.Interface;
    using KMHC.SLTC.Persistence;
    using System;
    using System.Collections;
    using System.Collections.Generic;
    using System.Linq;

    public partial class DeviceService : BaseService, IDeviceService
    {
        #region ORG_Area
        public BaseResponse<IList<DeviceModel>> QueryDevice(BaseRequest<DeviceFilter> request)
        {
            var response = new BaseResponse<IList<DeviceModel>>();
            var q = from a in unitOfWork.GetRepository<DC_Device>().dbSet
                    select new DeviceModel
                    { 
                        ID = a.ID,
                        PersonID = a.PersonID,
                        DeviceNo = a.DeviceNo,
                        DeviceType = a.DeviceType,
                        DeviceName = a.DeviceName
                    };
            if (request.Data.PersonID.HasValue)
            {
                q = q.Where(m => m.PersonID == request.Data.PersonID.Value);
            }

            q = q.OrderByDescending(m => m.DeviceNo);
            response.RecordsCount = q.Count();
            if (request != null && request.PageSize > 0)
            {
                var list = q.Skip((request.CurrentPage - 1) * request.PageSize).Take(request.PageSize).ToList();
                response.PagesCount = GetPagesCount(request.PageSize, response.RecordsCount);
                response.Data = list;
            }
            else
            {
                var list = q.ToList();
                response.Data = list;
            }            
            return response;
        }

        public BaseResponse<DeviceModel> GetDevice(int deviceID)
        {
            return base.Get<DC_Device, DeviceModel>((q) => q.ID == deviceID);
        }

        public BaseResponse<DeviceModel> SaveDevice(DeviceModel request)
        {
            return base.Save<DC_Device, DeviceModel>(request, (q) => q.ID == request.ID);
        }

        public BaseResponse DeleteDevice(int deviceID)
        {
            return base.Delete<DC_Device>(deviceID);
        }
        #endregion
    }
}
