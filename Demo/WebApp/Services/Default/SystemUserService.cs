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
    public class SystemUserService : ApplicationService, ISystemUserService
    {

        public void CreateAdminUser()
        {
            string _userName = "admin";
            string _password = "admin";
            string password = EncrypManager.Encode(_password);
            SystemUser user = db.SystemUser.FirstOrDefault(n => n.UserName == _userName);
            if (user == null)
            {
                user = new SystemUser();
                user.DisplayName = _userName;
                user.UserName = _userName;
                user.Password = password;
                db.SystemUser.Add(user);
                db.SaveChanges();
            }

        }

        public void AddSystemUser(SystemUserDataInfo userInfo)
        {

            if (string.IsNullOrEmpty(userInfo.UserName) || string.IsNullOrEmpty(userInfo.Password))
            {
                throw new MissingDomainObjectException("用户名或者密码不能为空");
            }

            SystemUser existUser = db.SystemUser.FirstOrDefault(n => !n.IsDelete && n.UserName == userInfo.UserName);
            if (existUser != null)
            {
                throw new DuplicatedDomainObjectException(string.Format("【{0}】用户已存在，请勿重复添加", existUser.UserName));
            }
            if (existUser == null)
            {
                existUser = new SystemUser();
                existUser.DisplayName = userInfo.DisplayName;
                existUser.UserName = userInfo.UserName;
                existUser.Password = userInfo.Password;
                existUser.UserFace = userInfo.UserFace;
                db.SystemUser.Add(existUser);
                db.SaveChanges();
                AddSystemLog(new SystemLogDataInfo()
                {
                    ModulePage = "SystemUser",
                    Remark = string.Format("添加了用户，用户数据为：{0}", Newtonsoft.Json.JsonConvert.SerializeObject(existUser)),
                    CreationDate = DateTime.Now,
                    CreationUserID = CurrentAdminUserId,
                });
            }
        }


        public void UpdateSystemUser(SystemUserDataInfo userInfo)
        {

            if (string.IsNullOrEmpty(userInfo.UserName))
            {
                throw new MissingDomainObjectException("用户名不能为空");
            }
            SystemUser existUserByUserName = db.SystemUser.FirstOrDefault(n => !n.IsDelete && n.UserName == userInfo.UserName && n.ID != userInfo.ID);
            if (existUserByUserName != null)
            {
                throw new DuplicatedDomainObjectException(string.Format("【{0}】用户名已存在，修改失败", existUserByUserName.UserName));
            }
            SystemUser existUser = db.SystemUser.Find(userInfo.ID);
            SystemUserDataInfo userDataInfo = SimpleObjectMapper.CreateTargetObject<SystemUser, SystemUserDataInfo>(existUser);
            string oldData = Newtonsoft.Json.JsonConvert.SerializeObject(userDataInfo);
            if (existUser == null)
            {
                throw new DuplicatedDomainObjectException(string.Format("【{0}】用户不存在", existUser.UserName));
            }
            if (existUser != null)
            {
                existUser.DisplayName = userInfo.DisplayName;
                existUser.UserName = userInfo.UserName;
                if (!string.IsNullOrEmpty(userInfo.Password))
                {
                    existUser.Password = userInfo.Password;
                }
                db.SaveChanges();
                userDataInfo = SimpleObjectMapper.CreateTargetObject<SystemUser, SystemUserDataInfo>(existUser);
                AddSystemLog(new SystemLogDataInfo()
                {
                    ModulePage = "SystemUser",
                    Remark = string.Format("修改了用户，原数据为：{0} 修改后数据为：{1}", oldData, Newtonsoft.Json.JsonConvert.SerializeObject(userDataInfo)),
                    CreationDate = DateTime.Now,
                    CreationUserID = CurrentAdminUserId,
                });
            }
        }

        public void UpdateUserFace(int userID, string userFace)
        {
            SystemUser existUser = db.SystemUser.Find(userID);
            existUser.UserFace = userFace;
            db.SaveChanges();
            AddSystemLog(new SystemLogDataInfo()
            {
                ModulePage = "SystemUser",
                Remark = string.Format("修改了用户头像，图片地址为：{0}", userFace),
                CreationDate = DateTime.Now,
                CreationUserID = CurrentAdminUserId,
            });
        }


        public void UpdatePassword(UpdatePasswordDataInfo updatePassword)
        {

            if (string.IsNullOrEmpty(updatePassword.NewPassword))
            {
                throw new MissingDomainObjectException("新密码不能为空");
            }
            if (string.IsNullOrEmpty(updatePassword.OldPassword))
            {
                throw new MissingDomainObjectException("旧密码不能为空");
            }
            SystemUser existUser = db.SystemUser.FirstOrDefault(n => n.ID == updatePassword.ID && n.Password == updatePassword.OldPassword);
            if (existUser == null)
            {
                throw new DuplicatedDomainObjectException("密码验证错误");
            }
            if (existUser != null)
            {
                existUser.Password = updatePassword.NewPassword;
                db.SaveChanges();
                AddSystemLog(new SystemLogDataInfo()
                {
                    ModulePage = "SystemUser",
                    Remark = "修改了密码",
                    CreationDate = DateTime.Now,
                    CreationUserID = CurrentAdminUserId,
                });
            }
        }

        public void DeleteSystemUser(int Id)
        {
            SystemUser existUser = db.SystemUser.Find(Id);
            if (existUser == null)
            {
                throw new DuplicatedDomainObjectException("用户不存在");
            }
            existUser.IsDelete = true;
            db.SaveChanges();
            SystemUserDataInfo userDataInfo = SimpleObjectMapper.CreateTargetObject<SystemUser, SystemUserDataInfo>(existUser);
            AddSystemLog(new SystemLogDataInfo()
            {
                ModulePage = "SystemUser",
                Remark = string.Format("虚拟删除了用户，用户数据为：{0}", Newtonsoft.Json.JsonConvert.SerializeObject(userDataInfo)),
                CreationDate = DateTime.Now,
                CreationUserID = CurrentAdminUserId,
            });
        }


        public List<SystemUserDataInfo> GetSystemUserDataInfos(string searchText, int pageSize, int pageIndex, out int recordCount)
        {

            List<SystemUser> users = null;
            if (string.IsNullOrEmpty(searchText))
            {
                users = db.SystemUser.Where(n => !n.IsDelete).OrderByDescending(n => n.ID).ToList();
                recordCount = db.SystemUser.Where(n => !n.IsDelete).Count();
            }
            else
            {
                users = db.SystemUser.Where(n => !n.IsDelete && (n.DisplayName.Contains(searchText) || n.UserName.Contains(searchText))).OrderByDescending(n => n.ID).ToList();
                recordCount = db.SystemUser.Where(n => !n.IsDelete && (n.DisplayName.Contains(searchText) || n.UserName.Contains(searchText))).Count();
            }
            users = users.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            List<SystemUserDataInfo> userDataInfos = SimpleObjectMapper.ListMap<SystemUser, SystemUserDataInfo>(users).ToList();
            return userDataInfos;
        }


        public SystemUserDataInfo GetSystemUserDataInfoByID(int Id)
        {
            SystemUser user = db.SystemUser.Find(Id);
            SystemUserDataInfo userDataInfo = SimpleObjectMapper.CreateTargetObject<SystemUser, SystemUserDataInfo>(user);
            return userDataInfo;

        }

        public SystemUserDataInfo GetSystemUserDataInfoByLogin(string userName, string password)
        {
            SystemUser user = db.SystemUser.FirstOrDefault(n => !n.IsDelete && n.UserName == userName && n.Password == password);
            SystemUserDataInfo userDataInfo = SimpleObjectMapper.CreateTargetObject<SystemUser, SystemUserDataInfo>(user);
            if (userDataInfo != null)
            {
                AddSystemLog(new SystemLogDataInfo()
                {
                    ModulePage = "SystemUser",
                    Remark = "登录了系统",
                    CreationDate = DateTime.Now,
                    CreationUserID = userDataInfo.ID,
                });
            }
            return userDataInfo;
        }

    }
}