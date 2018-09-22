using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApp.Controllers
{
    public class AdminController : BaseAdminController
    {
        // GET: Admin
        public ActionResult Index()
        {
            return View();
        }


        public ActionResult Users()
        {
            return View();
        }

        public ActionResult SystemSetting()
        {
            return View();
        }
        public ActionResult MyUserInfo()
        {
            return View();
        }

        public ActionResult ScenicSpots()
        {
            return View();
        }
        public ActionResult Hotels()
        {
            return View();
        }
        public ActionResult DiningRooms()
        {
            return View();
        }
        public ActionResult Provinces()
        {
            return View();
        }
    }
}