using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser // all we need is already inside IdentityUser class
    // we can use directly IdentityUser class, but we cannot add custom fields inside without creating a Children class User
    {
        
    }
}