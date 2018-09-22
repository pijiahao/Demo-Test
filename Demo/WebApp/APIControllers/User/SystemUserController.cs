using Microsoft.Practices.Unity;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using WebApp.DataContracts;
using WebApp.Services;
using WebApp.Services.Interface;
using WebApp.Utilities;

namespace WebApp.APIControllers
{
    public class SystemUserController : BaseAdminApiController
    {
        [Dependency]
        public ISystemUserService SystemUserService { get; set; }
        [Dependency]
        public ISystemLogService SystemLogService { get; set; }


        [HttpPost]
        public HttpResponseMessage AddOrUpdateSystemUser(SystemUserDataInfo systemUserDataInfo)
        {
            string responseMsg = string.Empty;
            if (systemUserDataInfo.ID > 0)
            {
                if (!string.IsNullOrEmpty(systemUserDataInfo.Password))
                {
                    systemUserDataInfo.Password = EncrypManager.Encode(systemUserDataInfo.Password);
                }
                SystemUserService.UpdateSystemUser(systemUserDataInfo);
                responseMsg = "修改成功";
            }
            else
            {
                systemUserDataInfo.Password = EncrypManager.Encode(systemUserDataInfo.Password);
                SystemUserService.AddSystemUser(systemUserDataInfo);
                responseMsg = "添加成功";
            }

            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, responseMsg);
        }
        private byte[] StreamToBytes(Stream stream)

        {

            byte[] bytes = new byte[stream.Length];

            stream.Read(bytes, 0, bytes.Length);

            // 设置当前流的位置为流的开始 

            stream.Seek(0, SeekOrigin.Begin);

            return bytes;

        }

        public HttpResponseMessage UploadHeaderImage()
        {
            HttpRequest request = System.Web.HttpContext.Current.Request;
            HttpFileCollection fileCollection = request.Files;
            string headerImagePath = string.Empty;
            if (fileCollection.Count > 0)
            {
                string suffix = Path.GetExtension(fileCollection[0].FileName).ToLower();
                if (string.Equals(suffix, ".jpg") || string.Equals(suffix, ".gif") || string.Equals(suffix, ".png") || string.Equals(suffix, ".pdf"))
                {
                    var stream = fileCollection[0].InputStream;
                    string imgTempFolderPath = HttpContext.Current.Server.MapPath("~/data/image/");
                    if (!Directory.Exists(imgTempFolderPath))
                    {
                        Directory.CreateDirectory(imgTempFolderPath);
                    }
                    Random rd = new Random();
                    string fileName = CurrentUserID + "_" + rd.Next(10, 100).ToString() + "_" + fileCollection[0].FileName;
                    string imagePath = Path.Combine(imgTempFolderPath, fileName);
                    if (!File.Exists(imagePath))
                    {
                        byte[] myByte = StreamToBytes(stream);
                        using (var fileimage = File.Create(imagePath))
                        {
                            fileimage.Write(myByte, 0, myByte.Length);
                        };
                        headerImagePath = Path.Combine("/data/image/", fileName);
                        SystemUserService.UpdateUserFace(CurrentUserID, headerImagePath);
                    }
                }
                else
                {
                    return ResultJson.BuildJsonResponse(null, Models.MessageType.Warning, "请上传图片格式（.jpg，.gif，.png，.pdf）");
                }

            }
            return ResultJson.BuildJsonResponse(null, Models.MessageType.None, null);
        }

        [HttpGet]
        public HttpResponseMessage DeleteSystemUser(int id)
        {
            SystemUserService.DeleteSystemUser(id);
            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, "删除成功");
        }
        [HttpPost]
        public HttpResponseMessage UpdateInfo(SystemUserDataInfo systemUserDataInfo)
        {
            SystemUserDataInfo user = SystemUserService.GetSystemUserDataInfoByID(CurrentUserID);
            user.Password = string.Empty;
            user.DisplayName = systemUserDataInfo.DisplayName;
            SystemUserService.UpdateSystemUser(user);
            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, "修改成功");
        }
        [HttpPost]
        public HttpResponseMessage UpdatePassWord(UpdatePasswordDataInfo updatePassword)
        {
            updatePassword.ID = CurrentUserID;
            updatePassword.NewPassword = EncrypManager.Encode(updatePassword.NewPassword);
            updatePassword.OldPassword = EncrypManager.Encode(updatePassword.OldPassword);
            SystemUserService.UpdatePassword(updatePassword);
            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, "修改成功");
        }

        [HttpGet]
        public HttpResponseMessage QuerySystemUserByPage(string searchText, int pageIndex = 1, int pageSize = 10)
        {
            int recordCount = 0;
            List<SystemUserDataInfo> userDataInfos = SystemUserService.GetSystemUserDataInfos(searchText, pageSize, pageIndex, out recordCount);
            return ResultJson.BuildJsonResponse(new { total = recordCount, rows = userDataInfos }, Models.MessageType.None, null);
        }

        [HttpGet]
        public HttpResponseMessage QuerySystemLogByPage(string searchText, int userId = 0, int pageIndex = 1, int pageSize = 10)
        {
            int recordCount = 0;
            List<SystemLogDataInfo> logDataInfos = SystemLogService.GetSystemLogDataInfos(searchText, userId, pageSize, pageIndex, out recordCount);
            return ResultJson.BuildJsonResponse(new { total = recordCount, rows = logDataInfos }, Models.MessageType.None, null);
        }

        [HttpGet]
        public HttpResponseMessage DeleteSystemLog(int id)
        {
            SystemLogService.DeleteSystemLog(id);
            return ResultJson.BuildJsonResponse(null, Models.MessageType.Information, "删除成功");
        }

    }
}
