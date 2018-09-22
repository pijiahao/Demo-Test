using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using WebApp.DataContracts;
using WebApp.EFModel;
using WebApp.Services.Interface;
using WebApp.Utilities;

namespace WebApp.Services.Default
{
    public class SystemLogService : ApplicationService, ISystemLogService
    {
        public void DeleteSystemLog(int Id)
        {
            SystemLog existLog = db.SystemLog.Find(Id);
            if (existLog == null)
            {
                throw new DuplicatedDomainObjectException("日志不存在");
            }
            db.SystemLog.Remove(existLog);
            db.SaveChanges();
        }

        public List<SystemLogDataInfo> GetSystemLogDataInfos(string searchText, int userID, int pageSize, int pageIndex, out int recordCount)
        {
            recordCount = 0;
            List<SystemLog> logs = null;
            if (string.IsNullOrEmpty(searchText) && userID == 0)
            {
                logs = db.SystemLog.OrderByDescending(n => n.ID).ToList();
                recordCount = db.SystemLog.Count();
            }
            else
            {
                if (!string.IsNullOrEmpty(searchText))
                {
                    logs = db.SystemLog.Where(n => n.ModulePage.Contains(searchText) || n.Remark.Contains(searchText)).OrderByDescending(n => n.ID).ToList();
                    recordCount = db.SystemLog.Where(n => n.ModulePage.Contains(searchText) || n.Remark.Contains(searchText)).Count();
                }
                if (userID != 0)
                {
                    logs = db.SystemLog.Where(n => n.CreationUserID == userID).OrderByDescending(n => n.ID).ToList();
                    recordCount = db.SystemLog.Where(n => n.CreationUserID == userID).Count();
                }
            }
            logs = logs.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            List<SystemLogDataInfo> logDataInfos = SimpleObjectMapper.ListMap<SystemLog, SystemLogDataInfo>(logs).ToList();
            foreach (var item in logDataInfos)
            {
                SystemUser user = logs.FirstOrDefault(n => n.ID == item.ID).SystemUser;
                if (user != null)
                {
                    item.UserDisplayName = user.DisplayName;
                }
                item.Remark = item.UserDisplayName + item.Remark;
            }
            return logDataInfos;
        }
    }
}