using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.EFModel;
using WebApp.Utilities;

namespace WebApp.Controllers
{
    [AdminAuthorizeFilter]
    [AdminViewBagFilter]
    public class BaseAdminController : Controller
    {
        DBEntities db = new DBEntities();
        public int CurrentUserID
        {
            get
            {
                int userID = 0;
                try
                {
                    userID = int.Parse(CookieUtil.GetCookie(CookieName.IMAdminCurrentUser));
                }

                catch
                {
                    userID = 0;
                }
                return userID;
            }
        }
        public virtual void UpdateViewBag()
        {
            ViewBag.UserInfo = db.SystemUser.Find(CurrentUserID);
        }



    }
}