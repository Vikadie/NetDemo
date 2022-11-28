using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Identity;

namespace API.Entities
{
    public class Role : IdentityRole<int> // <int> required to transform the id to int (instead of string as automatically created by Identity class).
                                          // this is required for the type match with the IdentityUser class inside User
                                          // so the Role should replace Identity Role inside the StoreContext and Startup Class

    // This will require removing all DB and migrations and migrate again
    {
        
    }
}