using System;
using System.IO;
using log4net;
using log4net.Appender;
using log4net.Core;
using log4net.Layout;
using log4net.Repository.Hierarchy;
using System.Reflection;
using System.Web;

namespace WebApp
{
    public class ServerLogger
    {
        private static ILog Log { get; set; }

        static ServerLogger()
        {
            try
            {
                string appPath = HttpRuntime.AppDomainAppPath;
                string logFolder = appPath + "log\\";
                if (!Directory.Exists(logFolder))
                {
                    Directory.CreateDirectory(logFolder);
                }
                Hierarchy hierarchy = (Hierarchy)LogManager.GetRepository();

                PatternLayout patternLayout = new PatternLayout();
                patternLayout.ConversionPattern = "%date{yyyy-MM-dd HH:mm:ss.fff} %level %message%newline";
                patternLayout.ActivateOptions();

                RollingFileAppender roller = new RollingFileAppender();
                roller.AppendToFile = true;
                roller.File = logFolder + @"\server.log";
                roller.Layout = patternLayout;
                roller.MaxSizeRollBackups = 100;

                roller.RollingStyle = RollingFileAppender.RollingMode.Date;
                roller.StaticLogFileName = true;
                roller.ActivateOptions();
                hierarchy.Configured = true;

                Logger logger = hierarchy.GetLogger("ServerLogger") as Logger;//Log as Logger;
                logger.Additivity = false;
                logger.Level = Level.All;
                logger.AddAppender(roller);

                Log = LogManager.GetLogger("ServerLogger");
            }
            catch (Exception ex)
            {

            }
        }

        public static void Debug(string message)
        {
            Log.Debug(message);
        }

        public static void Info(string message)
        {
            Log.Info(message);
        }

        public static void Warn(string message)
        {
            Log.Warn(message);
        }

        public static void Error(string message)
        {
            Log.Error(message);
        }

        public static void Fatal(string message)
        {
            Log.Fatal(message);
        }
    }
}
