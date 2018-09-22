
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Web;
using System.Web.Http.Filters;
using WebApp.APIControllers;

namespace WebApp.Utilities
{
    public class WebApiControllerExceptionFilterAttribute : ExceptionFilterAttribute
    {
        public override void OnException(HttpActionExecutedContext actionExecutedContext)
        {
            StringBuilder lobjLogBuilder = new StringBuilder();
            lobjLogBuilder.Append("Error occurred in WebApi.");
            lobjLogBuilder.Append(string.Format("Controller-{0};", actionExecutedContext.ActionContext.ControllerContext.RouteData.Values["controller"]));
            lobjLogBuilder.Append(string.Format("ExceptionMessage-{0};", actionExecutedContext.Exception.Message));
            // lobjLogBuilder.Append(string.Format("Action-{0};", actionExecutedContext.ActionContext.ControllerContext.RouteData.Values["action"]));
            //lobjLogBuilder.Append(string.Format("Id-{0};", actionExecutedContext.ActionContext.ControllerContext.RouteData.Values["id"]));
            ServerLogger.Error(lobjLogBuilder.ToString());

            HttpStatusCode code = HttpStatusCode.InternalServerError;

            // Can provide mode exception
            if (actionExecutedContext.Exception is MissingDomainObjectException)
            {
                code = HttpStatusCode.NotFound;
            }
            else if (actionExecutedContext.Exception is DuplicatedDomainObjectException)
            {
                code = HttpStatusCode.Conflict;
            }
            else if (actionExecutedContext.Exception is MissingRequiredFieldException)
            {
                code = HttpStatusCode.NotAcceptable;
            }
            else if (actionExecutedContext.Exception is MissingFileObjectException)
            {
                code = HttpStatusCode.NotFound;
            }
            else if (actionExecutedContext.Exception is ArgumentNullException)
            {
                code = HttpStatusCode.BadRequest;
            }
            else if (actionExecutedContext.Exception is NotImplementedException)
            {
                code = HttpStatusCode.NotImplemented;
            }
            else if (actionExecutedContext.Exception is UnauthorizedAccessException)
            {
                code = HttpStatusCode.Unauthorized;
            }

            actionExecutedContext.Response = ResultJson.BuildExceptionJsonResponse(code, actionExecutedContext.Exception);
            //base.OnException(actionExecutedContext);
        }
    }
}