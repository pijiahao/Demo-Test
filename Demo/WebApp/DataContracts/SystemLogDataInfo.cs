using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.DataContracts
{
    public class SystemLogDataInfo
    {
        public long ID { get; set; }
        public string ModulePage { get; set; }
        public string Remark { get; set; }
        public System.DateTime CreationDate { get; set; }
        public int? CreationUserID { get; set; }

        public string UserDisplayName { get; set; }
    }
}