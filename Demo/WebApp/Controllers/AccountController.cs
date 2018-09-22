using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Security;
using System.Xml;
using System.Configuration;
using WebApp.Models;
using WebApp.Utilities;
using WebApp.EFModel;
using WebApp.Services;
using WebApp.DataContracts;
using WebApp.Services.Interface;
using Microsoft.Practices.Unity;
using WebApp;

namespace BIMPlatform.WebApplication.Controllers
{

    public class AccountController : Controller
    {
        [Dependency]
        public ISystemUserService SystemUserService { get; set; }
        //
        // GET: /Account/

        [HttpGet]
        public virtual ActionResult Login(string returnUrl)
        {
            SystemUserService.CreateAdminUser();
            try
            {
                ViewBag.ReturnUrl = returnUrl;
            }
            catch (Exception ex)
            {
                ServerLogger.Error(ex.Message);
            }

            return View();
        }
        [HttpGet]
        public virtual ActionResult AdminLogin(string returnUrl)
        {
            SystemUserService.CreateAdminUser();
            try
            {
                ViewBag.ReturnUrl = returnUrl;
            }
            catch (Exception ex)
            {
                ServerLogger.Error(ex.Message);
            }

            return View();
        }
        //
        // POST: /Account/Login
        [HttpPost]
        public virtual ActionResult AdminLogin(LoginViewModel model, string returnUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
                {
                    ModelState.AddModelError("", "请输入用户名或密码。");
                    return View(model);
                }
                string password = EncrypManager.Encode(model.Password);
                SystemUserDataInfo user = SystemUserService.GetSystemUserDataInfoByLogin(model.UserName, password);
                if (user != null)
                {
                    FormsAuthentication.SetAuthCookie(user.UserName, false);
                    CookieUtil.CreateCookie(user.ID, CookieName.IMAdminCurrentUser);
                    return RedirectToAction("Index", "Admin");
                }
                else
                {
                    ModelState.AddModelError("", "用户名或密码错误");
                }

            }
            catch (Exception ex)
            {
                ServerLogger.Error("Failed to log in.");
                ModelState.AddModelError("", ex.Message);
                return View(model);
            }
            return View(model);
        }
        [HttpGet]
        public ActionResult AdminLogout()
        {
            CookieUtil.DelCookie(CookieName.IMAdminCurrentUser);
            return RedirectToAction("AdminLogin", "Account");

        }
        //
        // POST: /Account/Login
        [HttpPost]
        public virtual ActionResult Login(LoginViewModel model, string returnUrl)
        {
            try
            {
                if (string.IsNullOrEmpty(model.UserName) || string.IsNullOrEmpty(model.Password))
                {
                    ModelState.AddModelError("", "请输入用户名或密码。");
                    return View(model);
                }
                string password = EncrypManager.Encode(model.Password);
                SystemUserDataInfo user = SystemUserService.GetSystemUserDataInfoByLogin(model.UserName, password);
                if (user != null)
                {
                    FormsAuthentication.SetAuthCookie(user.UserName, false);
                    CookieUtil.CreateCookie(user.ID, CookieName.IMCurrentUser);
                    return RedirectToAction("Index", "Home");
                }
                else
                {
                    ModelState.AddModelError("", "用户名或密码错误");
                }

            }
            catch (Exception ex)
            {
                ServerLogger.Error("Failed to log in.");
                ModelState.AddModelError("", ex.Message);
                return View(model);
            }
            return View(model);
        }

        [HttpGet]
        public ActionResult Logout()
        {
            CookieUtil.DelCookie(CookieName.IMCurrentUser);
            return RedirectToAction("Login", "Account");

        }
    }
}
