using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ViewModels
{
    public class UserViewModel
    {
        public string FirstName { get; set; }
        public string LastName { get; set; }
        [IgnoreMap]
        public string ProfilePhoto { get; set; }
        [IgnoreMap]
        public string CoverPhoto { get; set; }
        public string UserName { get; set; }
        public string Id { get; set; }
        public bool FinishedFirstTimeLogin { get; set; }
    }
}
