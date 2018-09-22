using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.DataContracts;

namespace WebApp.Services.Interface
{
    public interface ISystemUserService
    {
        void CreateAdminUser();
        void AddSystemUser(SystemUserDataInfo userInfo);
        void UpdateSystemUser(SystemUserDataInfo userInfo);
        void UpdateUserFace(int userID, string userFace);

        void UpdatePassword(UpdatePasswordDataInfo updatePassword);
        void DeleteSystemUser(int Id);

        List<SystemUserDataInfo> GetSystemUserDataInfos(string searchText, int pageSize, int pageIndex, out int recordCount);

        SystemUserDataInfo GetSystemUserDataInfoByID(int Id);
        SystemUserDataInfo GetSystemUserDataInfoByLogin(string userName, string password);

    }
}