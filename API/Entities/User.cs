using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class User : IdentityUser<int> // all we need is already inside IdentityUser class. We put <int> to define that the Id should be int.
                                          // that creates a clash with the IdentityRole table (automatic inside Identity), so this class should be overwritten too
    // we can use directly IdentityUser class, but we cannot add custom fields inside without creating a Children class User
    {
        // add default address to a User
        public UserAddress Address { get; set; }
    }
}