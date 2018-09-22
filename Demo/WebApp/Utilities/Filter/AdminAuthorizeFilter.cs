using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http.Controllers;
using System.Web.Mvc;
using System.Web.Routing;
using System.Security.Principal;
using System.Reflection;
using WebApp.Controllers;
using WebApp.EFModel;
using WebApp.Services;
using WebApp.DataContracts;
using WebApp.Services.Interface;
using Microsoft.Practices.Unity;

namespace WebApp.Utilities
{
    public class AdminAuthorizeFilter : AuthorizeAttribute
    {
        protected override bool AuthorizeCore(HttpContextBase httpContext)
        {
            // Copy low level code
            //if (httpContext == null)
            //    throw new ArgumentNullException("httpContext");

            //Type baseType = typeof(AuthorizeAttribute);
            //FieldInfo userFI = baseType.GetField("_usersSplit", System.Reflection.BindingFlags.GetProperty | System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.GetField | System.Reflection.BindingFlags.NonPublic);
            //string[] _usersSplit = userFI.GetValue(this) as string[];

            //FieldInfo roleFI = baseType.GetField("_rolesSplit", System.Reflection.BindingFlags.GetProperty | System.Reflection.BindingFlags.Instance | System.Reflection.BindingFlags.GetField | System.Reflection.BindingFlags.NonPublic);
            //string[] _rolesSplit = roleFI.GetValue(this) as string[];

            //IPrincipal user = httpContext.User;
            //bool result =  user.Identity.IsAuthenticated &&
            //    (_usersSplit.Length <= 0 || Enumerable.Contains<string>((IEnumerable<string>)_usersSplit, user.Identity.Name, (IEqualityComparer<string>)StringComparer.OrdinalIgnoreCase)) &&
            //    (_rolesSplit.Length <= 0 || Enumerable.Any<string>((IEnumerable<string>)_rolesSplit, new Func<string, bool>(user.IsInRole)));
            bool result = base.AuthorizeCore(httpContext);
            ServerLogger.Info(string.Format("Authorized? {0}", result.ToString()));
            return result;
        }

        public override void OnAuthorization(AuthorizationContext filterContext)
        {
            BaseAdminController controller = filterContext.Controller as BaseAdminController;
            if (controller != null)
            {
                base.OnAuthorization(filterContext);
                ServerLogger.Info(string.Format("Authorize controller {0}", controller.GetType().ToString()));
                ISystemUserService systemUserService = (ISystemUserService)Bootstrapper.GetService<ISystemUserService>();
                SystemUserDataInfo user = systemUserService.GetSystemUserDataInfoByID(controller.CurrentUserID);
                if (user == null)
                {
                    filterContext.Result = new RedirectResult("/Account/AdminLogin");
                }
                else
                {
                    base.OnAuthorization(filterContext);
                }

            }
            else
            {

                base.OnAuthorization(filterContext);
            }
        }
    }
}