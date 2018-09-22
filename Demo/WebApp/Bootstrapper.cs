
using System.Web.Mvc;
using WebApp.Services.Default;
using WebApp.Services.Interface;
using Unity.WebApi;
using System.Web.Http;
using Microsoft.Practices.Unity;
using WebApp.Utilities;
using System;
using System.Collections.Generic;

namespace WebApp
{
    public static class Bootstrapper
    {
        public static IUnityContainer Initialise()
        {
            var container = BuildUnityContainer();

            DependencyResolver.SetResolver(new MVCUnityDependencyResolver(container));//mvcע��
            GlobalConfiguration.Configuration.DependencyResolver = new UnityDependencyResolver(container);//webapi ע��

            return container;
        }

        public static object GetService<T>()
        {
            var container = BuildUnityContainer();
            try
            {
                return container.Resolve<T>();
            }
            catch
            {
                return null;
            }          
        }

        private static IUnityContainer BuildUnityContainer()
        {
            var container = new UnityContainer();

            // register all your components with the container here
            // it is NOT necessary to register your controllers

            // e.g. container.RegisterType<ITestService, TestService>();    
            RegisterTypes(container);

            return container;
        }

        public static void RegisterTypes(IUnityContainer container)
        {
            //��Ŀ��Ļ�������unity.config����
            container.RegisterType<IUserService, UserService>();
            container.RegisterType<ISystemUserService, SystemUserService>();
            container.RegisterType<ISystemLogService, SystemLogService>(); 
        }
    }
}