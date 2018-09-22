
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Web;
using System.Web.Mvc;
using WebApp.Models;

namespace WebApp.Utilities
{
    public class MvcControllerHandleErrorAttribute : System.Web.Mvc.HandleErrorAttribute
    {
        public override void OnException(System.Web.Mvc.ExceptionContext filterContext)
        {
            StringBuilder lobjLogBuilder = new StringBuilder();
            lobjLogBuilder.Append("Error occurred in controller action.");
            lobjLogBuilder.Append(string.Format("Controller-{0};", filterContext.RouteData.Values["controller"]));
            lobjLogBuilder.Append(string.Format("Action-{0};", filterContext.RouteData.Values["action"]));
            lobjLogBuilder.Append(string.Format("ExceptionMessage-{0};", filterContext.Exception.InnerException.Message));
            ServerLogger.Error(lobjLogBuilder.ToString());
            filterContext.ExceptionHandled = true;
            MessageModel msgModel = new MessageModel(MessageType.Error, ExceptionHelper.GetMessage(filterContext.Exception));
            ResultDataBag lobjResult = new ResultDataBag(true, msgModel, null);
            filterContext.Result = new JsonResult() { Data = lobjResult, JsonRequestBehavior = JsonRequestBehavior.AllowGet };
            base.OnException(filterContext);
        }
    }
}