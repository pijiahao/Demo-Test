using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using WebApp.DataContracts;
using WebApp.Services.Interface;
using Microsoft.Practices.Unity;

namespace WebApp.APIControllers.User
{
    public class UserController : BaseAdminApiController
    {
        [Dependency]
        public IUserService UserService { get; set; }
        
        [HttpGet]
        public HttpResponseMessage QueryUserByPage(string searchText, int pageIndex = 1, int pageSize = 10)
        {
            int recordCount = 0;
            List<UserDataInfo> userDataInfos = UserService.GetUserDataInfos(searchText, pageSize, pageIndex, out recordCount);
            return ResultJson.BuildJsonResponse(new { total = recordCount, rows = userDataInfos }, Models.MessageType.None, null);
        }
        [HttpGet]
        public HttpResponseMessage UseUserAction(string ids, bool actionResult)
        {
            string[] userIdsStr = ids.Split(',');
            List<long> userIDs = Array.ConvertAll(userIdsStr, new Converter<string, long>(long.Parse)).ToList();
            UserService.UseUserAction(userIDs, actionResult);
            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, "设置成功");
        }

        

    }
}
