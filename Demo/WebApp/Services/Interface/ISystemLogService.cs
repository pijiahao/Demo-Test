using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.DataContracts;

namespace WebApp.Services.Interface
{
    public interface ISystemLogService
    {
        void DeleteSystemLog(int Id);
        List<SystemLogDataInfo> GetSystemLogDataInfos(string searchText, int userID, int pageSize, int pageIndex, out int recordCount);
    }
}