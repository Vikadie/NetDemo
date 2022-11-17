using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    // DbContext is a mixture of Unit of Work and Repository Patterns (meaning that we can use it to outsource the DB logic)
    {
        public StoreContext(DbContextOptions options) : base(options) // the base class is the DbContext class - we pass to it these options
        {
        }

        // for each of our Entities we need to create a DbSet property
        public DbSet<Product> Products { get; set; } // Products is the name of the table, Product is the row/data type as found in API/Entities, DbSet is simply of type table
        public DbSet<Basket> Baskets { get; set; } // creating a baskets table, to store all the baskets inside. Entity Framework will automatically creates additioanl table
        // in the backgroud for us when needed (for instant Basket table etc) but as we are not going to query thm, there is no need to create a separate DbSet for it
    }
}