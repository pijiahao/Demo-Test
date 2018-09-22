using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.DataContracts;

namespace WebApp.Services.Interface
{
    public interface IUserService
    {
        UserDataInfo SaveWeiXinUser(UserDataInfo userDataInfo);

        void CancelAttention(string openID);

        void UseUserAction(List<long> userIDs, bool result);

        List<UserDataInfo> GetUserDataInfos(string searchText, int pageSize, int pageIndex, out int recordCount);
    }
}