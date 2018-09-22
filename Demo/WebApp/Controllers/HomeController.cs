using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApp.Services.Interface;

namespace WebApp.Controllers
{
    public class HomeController : Controller
    {
       
        // GET: Home
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


    }
}