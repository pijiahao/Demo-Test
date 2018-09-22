using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.IO;
using WebApp.Controllers;

namespace WebApp.Utilities
{
    public class AdminViewBagFilterAttribute : System.Web.Mvc.FilterAttribute, IResultFilter
    {
        public void OnResultExecuted(ResultExecutedContext filterContext)
        {

        }

        public void OnResultExecuting(ResultExecutingContext filterContext)
        {
            BaseAdminController controller = filterContext.Controller as BaseAdminController;
            if (controller != null)
            {
                controller.UpdateViewBag();
            }
        }


    }
}