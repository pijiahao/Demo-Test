using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApp.DataContracts
{
    public class UserDataInfo
    {
        public long ID { get; set; }
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Password { get; set; }
        public string Country { get; set; }
        public string Province { get; set; }
        public string City { get; set; }
        public string Sex { get; set; }
        public string OpenID { get; set; }
        public string UserFace { get; set; }
        public System.DateTime CreationDateTime { get; set; }
        public System.DateTime AttentionDateTime { get; set; }
        public DateTime CancelAttentionDateTime { get; set; }
        public bool CanAttention { get; set; }
        public string Remark { get; set; }
        public int SourceProductID { get; set; }
        public string Email { get; set; }
        public string Phone { get; set; }

        public bool IsUse { get; set; }

        public string ProductName { get; set; }
    }
}