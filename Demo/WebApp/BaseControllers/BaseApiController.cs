using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Http;
using System.Web.Mvc;
using WebApp.Utilities;

namespace WebApp.APIControllers
{
    [WebApiControllerExceptionFilter]
    public class BaseApiController : System.Web.Http.ApiController
    {
        public int CurrentUserID
        {
            get
            {
                int userID = 0;
                try
                {
                    userID = int.Parse(CookieUtil.GetCookie(CookieName.IMCurrentUser));
                }

                catch
                {
                    userID = 0;
                }
                return userID;
            }
        }



    }
}
