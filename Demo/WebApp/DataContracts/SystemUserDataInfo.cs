using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.DataContracts
{
    public class SystemUserDataInfo
    {
        public int ID { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string UserFace { get; set; }
    }

    public class UpdatePasswordDataInfo {
        public int ID { get; set; }

        public string NewPassword { get; set; }

        public string OldPassword { get; set; }

    }
}