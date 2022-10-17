using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : DbContext
    {
        public StoreContext(DbContextOptions options) : base(options) // the base class is the DbContext class - we pass to it these options
        {
        }

        // for each of our Entities we need to create a DbSet property
        public DbSet<Product> Products { get; set; } // Products is the name of the table, Product is the row/data type as found in API/Entities, DbSet is simply of type table
    }
}