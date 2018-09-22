using System.Web;
using System.Web.Optimization;

namespace WebApp
{
    public class BundleConfig
    {
        // 有关捆绑的详细信息，请访问 https://go.microsoft.com/fwlink/?LinkId=301862
        public static void RegisterBundles(BundleCollection bundles)
        {
            #region Layout
            bundles.Add(new ScriptBundle("~/Layout/js").Include(
                        "~/Content/common/jQuery/jQuery-v2.1.0.js",
                         "~/Content/common/jQuery/jquery-validate/jquery-validate.min.js",
                         "~/Content/common/jQuery/jquery-validate/messages_zh.js",
                        "~/Content/common/custom/js/ajaxCustom.js",
                        "~/Content/common/bootstrap/dist/js/bootstrap.min.js",
                        "~/Content/common/bootstrap-table/bootstrap-table.js",
                        "~/Content/common/sweetalert/sweetalert.js"
                        ));

            bundles.Add(new StyleBundle("~/Layout/css").Include(
                      "~/Content/common/bootstrap/dist/css/bootstrap.min.css",             
                     "~/Content/common/sweetalert/sweetalert.css"
                      ));
            #endregion

            #region 自定义上传控件
            bundles.Add(new ScriptBundle("~/Content/UploadFile/js").Include(
               "~/Content/common/UploadFile/uploadfile.js"
            ));
            bundles.Add(new StyleBundle("~/Content/UploadFile/css").Include(
                  "~/Content/common/UploadFile/fileinput.css",
                  "~/Content/common/UploadFile/uploadfile.css"
                ));
            #endregion

        }
    }
}
