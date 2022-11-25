using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using API.Entities.OrderAggregate;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace API.Data
{
    public class StoreContext : IdentityDbContext<User> // switch from DbContext to IdentityDbContext with the user class that we will use
    // DbContext is a mixture of Unit of Work and Repository Patterns (meaning that we can use it to outsource the DB logic)
    {
        public StoreContext(DbContextOptions options) : base(options) // the base class is the DbContext class - we pass to it these options
        {
        }

        // for each of our Entities we need to create a DbSet property
        public DbSet<Product> Products { get; set; } // Products is the name of the table, Product is the row/data type as found in API/Entities, DbSet is simply of type table
        public DbSet<Basket> Baskets { get; set; } // creating a baskets table, to store all the baskets inside. Entity Framework will automatically creates additioanl table
        // in the backgroud for us when needed (for instant Basket table etc) but as we are not going to query thm, there is no need to create a separate DbSet for it

        public DbSet<Order> Orders { get; set; }

        //alternative of seeding data (differs from the Initializer class previously created)
        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder); // it is an override of existing OnModelCreating function available inside IdentityDbContext

            builder.Entity<IdentityRole>() //adds new data to the table inside migration
                .HasData( //the data to be added
                    new IdentityRole{Name="Member", NormalizedName="MEMBER"},
                    new IdentityRole{Name="Admin", NormalizedName="ADMIN"}
                );
        }
    }
}