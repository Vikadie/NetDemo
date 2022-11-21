using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace API.DTOs
{
    public class UserDto // will be used in out TokenService
    {
        public string Email { get; set; } // in our UI we will display only the User Email
        public string Token { get; set; }
    }
}