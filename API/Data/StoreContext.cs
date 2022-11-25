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
    public class StoreContext : IdentityDbContext<User, Role, int> // int in the end is needed to show that all our Identity classes uses int as Id fields
    // switch from DbContext to IdentityDbContext with the user class that we will use
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

            builder.Entity<User>() // we specify the User Entity
                .HasOne(a => a.Address) // that has one novigation property address
                .WithOne() // with one to one relationship, meaning one user with one address
                .HasForeignKey<UserAddress>(a => a.Id) // useing the foreign key id inside the UserAddress class
                .OnDelete(DeleteBehavior.Cascade); //when User Entity deleted, to delete the UserAddress as well

            builder.Entity<Role>() //adds new data to the table inside migration
                .HasData( //the data to be added
                    new Role{Id=1, Name="Member", NormalizedName="MEMBER"}, // the problem with using int as Id is that now it should be harcoded here
                    new Role{Id=2, Name="Admin", NormalizedName="ADMIN"}
                );
        }
    }
}