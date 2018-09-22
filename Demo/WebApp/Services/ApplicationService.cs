using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.Controllers;
using WebApp.DataContracts;
using WebApp.EFModel;
using WebApp.Utilities;

namespace WebApp.Services
{
    public abstract class ApplicationService
    {
        public ApplicationService()
        {
            db = new DBEntities();
            BaseAdminController baseAdminController = new BaseAdminController();
            CurrentAdminUserId = baseAdminController.CurrentUserID;
            BaseController baseController = new BaseController();
            CurrentUserId = baseController.CurrentUserID;
        }
        public DBEntities db { get; set; }

        public int CurrentAdminUserId { get; set; }
        public int CurrentUserId { get; set; }

        public void AddSystemLog(SystemLogDataInfo systemLogDatainfo)
        {
            SystemLog systemLog = SimpleObjectMapper.CreateTargetObject<SystemLogDataInfo, SystemLog>(systemLogDatainfo);
            db.SystemLog.Add(systemLog);
            db.SaveChanges();
        }
    }
}