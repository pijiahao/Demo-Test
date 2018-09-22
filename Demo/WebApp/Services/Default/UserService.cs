using Newtonsoft.Json;
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
    public class UserService : ApplicationService, IUserService
    {

        public UserDataInfo SaveWeiXinUser(UserDataInfo userDataInfo)
        {
            UserDataInfo newUserDataInfo = null;
            try
            {
                User user = db.User.FirstOrDefault(n => n.OpenID == userDataInfo.OpenID);
                if (user == null)
                {
                    user = new User();
                    user.OpenID = userDataInfo.OpenID;
                    user.AttentionDateTime = userDataInfo.AttentionDateTime;
                    user.CanAttention = userDataInfo.CanAttention;
                    user.City = userDataInfo.City;
                    user.Country = userDataInfo.Country;
                    user.CreationDateTime = userDataInfo.CreationDateTime;
                    user.DisplayName = userDataInfo.DisplayName;
                    user.IsUse = userDataInfo.IsUse;
                    user.Province = userDataInfo.Province;
                    user.Remark = userDataInfo.Remark;
                    user.Sex = userDataInfo.Sex;
                    user.SourceProductID = userDataInfo.SourceProductID;
                    user.UserFace = userDataInfo.UserFace;
                    user.CancelAttentionDateTime = null;
                    ServerLogger.Info("SaveWeiXinUser :" + JsonConvert.SerializeObject(user));
                    db.User.Add(user);
                    db.SaveChanges();
                    AddSystemLog(new SystemLogDataInfo()
                    {
                        ModulePage = "User",
                        Remark = string.Format("{0}关注了公众号，用户微信数据为：{1}", userDataInfo.DisplayName, Newtonsoft.Json.JsonConvert.SerializeObject(userDataInfo)),
                        CreationDate = DateTime.Now,
                        CreationUserID = null
                    });
                }
                else
                {
                    if (!user.CanAttention)
                    {
                        user.CanAttention = true;
                        user.AttentionDateTime = DateTime.Now;
                        db.SaveChanges();
                        AddSystemLog(new SystemLogDataInfo()
                        {
                            ModulePage = "User",
                            Remark = string.Format("{0}重新关注了公众号，用户微信数据为：{1}", userDataInfo.DisplayName, Newtonsoft.Json.JsonConvert.SerializeObject(userDataInfo)),
                            CreationDate = DateTime.Now,
                            CreationUserID = null
                        });
                    }
                }
                newUserDataInfo = SimpleObjectMapper.CreateTargetObject<User, UserDataInfo>(user);
            }
            catch (Exception e)
            {
                throw e;
            }
            return newUserDataInfo;
        }

        public void CancelAttention(string openID)
        {
            User user = db.User.FirstOrDefault(n => n.OpenID == openID);
            if (user != null)
            {
                user.CanAttention = false;
                user.CancelAttentionDateTime = DateTime.Now;
                db.SaveChanges();
            }
        }


        public void UseUserAction(List<long> userIDs,bool result)
        {
            List<User> users = db.User.Where(n => userIDs.Contains(n.ID)).ToList();
            if (users != null)
            {
                foreach (var user in users)
                {
                    user.IsUse = result;
                }
                db.SaveChanges();
            }
        }

        public List<UserDataInfo> GetUserDataInfos(string searchText, int pageSize, int pageIndex, out int recordCount)
        {

            List<User> users = null;
            if (string.IsNullOrEmpty(searchText))
            {
                users = db.User.ToList();
                recordCount = db.User.Count();
            }
            else
            {
                users = db.User.Where(n => n.DisplayName.Contains(searchText) || n.UserName.Contains(searchText)).ToList();
                recordCount = db.User.Where(n => n.DisplayName.Contains(searchText) || n.UserName.Contains(searchText)).Count();
            }
            users = users.Skip((pageIndex - 1) * pageSize).Take(pageSize).ToList();
            List<UserDataInfo> userDataInfos = SimpleObjectMapper.ListMap<User, UserDataInfo>(users).ToList();
            foreach (var item in userDataInfos)
            {
               

            }
            return userDataInfos;
        }

    }
}