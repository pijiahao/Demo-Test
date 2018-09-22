using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Configuration;
namespace WebApp.Utilities
{
    public static class CookieUtil
    {
        public static int LoginExpirationIntervalMinutes = 120;


        public static void CreateCookie(object obj, string CookieName)
        {
            try
            {
                RemoveCookie(CookieName);
                DateTime NowDate = DateTime.Now;
                System.Web.HttpCookie IMCookie = new System.Web.HttpCookie(CookieName);//初使化并设置Cookie的名称       
                //IMCookie.Domain = "";
                IMCookie.Values.Add("obj", EncrypManager.Encode(obj.ToString()));//   
                IMCookie.Values.Add("e", EncrypManager.Encode(NowDate.AddMinutes(LoginExpirationIntervalMinutes).ToString()));//存储到期时间
                System.Web.HttpContext.Current.Response.AppendCookie(IMCookie);                                                    
            }
            catch (Exception ex)
            {
                ServerLogger.Error(ex.Message);
            }
        }

        public static string GetCookie(string CookieName)
        {
            string result = "0";
            try
            {
                if (System.Web.HttpContext.Current.Request.Cookies[CookieName] != null)
                {
                    System.Web.HttpCookie IMCookie = System.Web.HttpContext.Current.Request.Cookies[CookieName];
                   // IMCookie.Domain = "";
                    DateTime endDate = DateTime.Parse(EncrypManager.Decode(IMCookie["e"]));
                    // DateTime endDate = DateTime.Parse(IMCookie["e"]);
                    if (endDate > DateTime.Now)
                    {
                        RemoveCookie(CookieName);
                        System.Web.HttpCookie NewDiyCookie = new System.Web.HttpCookie(CookieName);
                      //  NewDiyCookie.Domain = "";
                        NewDiyCookie.Values.Add("obj", IMCookie["obj"]);
                        NewDiyCookie.Values.Add("e", EncrypManager.Encode(DateTime.Now.AddMinutes(LoginExpirationIntervalMinutes).ToString()));//存储到期时间
                        System.Web.HttpContext.Current.Response.AppendCookie(NewDiyCookie);
                        result = EncrypManager.Decode(IMCookie["obj"]);
                        //  result = IMCookie["obj"];
                    }
                }
            }
            catch (Exception ex)
            {
                ServerLogger.Error(ex.Message);
            }
            return result;
        }

        public static void DelCookie(string CookieName)
        {
            try
            {
                if (System.Web.HttpContext.Current.Request.Cookies[CookieName] != null)
                {
                    System.Web.HttpCookie IMCookie = System.Web.HttpContext.Current.Request.Cookies[CookieName];
                   // IMCookie.Domain = "";
                    DateTime endDate = DateTime.Parse(EncrypManager.Decode(IMCookie["e"]));
                    RemoveCookie(CookieName);
                    System.Web.HttpCookie NewDiyCookie = new System.Web.HttpCookie(CookieName);
                  //  NewDiyCookie.Domain = "";
                    NewDiyCookie.Values.Add("obj", IMCookie["obj"]);
                    NewDiyCookie.Values.Add("e", EncrypManager.Encode(DateTime.Now.AddMinutes(0 - LoginExpirationIntervalMinutes).ToString()));//存储到期时间
                    System.Web.HttpContext.Current.Response.AppendCookie(NewDiyCookie);

                }
            }
            catch (Exception ex)
            {
                ServerLogger.Error(ex.Message);
            }
        }

        private static void RemoveCookie(string CookieName)
        {
            for (int i = 0; i < System.Web.HttpContext.Current.Request.Cookies.Count; i++)
            {
                if (System.Web.HttpContext.Current.Request.Cookies[CookieName] != null)
                {
                    System.Web.HttpContext.Current.Request.Cookies.Remove(CookieName);
                }
            }
        }
    }
}