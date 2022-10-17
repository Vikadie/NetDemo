using System;
using API.Data;
using Microsoft.AspNetCore.Hosting;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace API
{
    public class Program
    {
        public static void Main(string[] args)
        {
            // normal way of running the program
            // CreateHostBuilder(args).Build().Run(); // created Kestrel server

            // current way of starting the program, so that is start with filling the database with fake products via DbInitializer
            var host = CreateHostBuilder(args).Build();
            using var scope = host.Services.CreateScope(); // creating the scope of services / with using it collects automatically the garbage when not used
            var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
            var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); 
            // logging if an error occurs during the database creation since Exceptions can be held only after the Run() command, as it i s in the Startup class

            try
            {
                context.Database.Migrate(); // migrate into the database. If DB doesn't exist it creates such
                DbInitializer.Initialize(context);
            }
            catch (Exception ex) // to catch the exception and set it in the ex variable
            {
                logger.LogError(ex, "Problem migrating data!");
            }
            // finally
            // {
            //     scope.Dispose(); // for garbage collection at the end (free up the ressources) - to be used if "scope" not created via "using" keyword; 
            // }

            host.Run(); // starts the program with Startup class
        }

        public static IHostBuilder CreateHostBuilder(string[] args) =>
            Host.CreateDefaultBuilder(args)
                .ConfigureWebHostDefaults(webBuilder =>
                {
                    webBuilder.UseStartup<Startup>();
                });
    }
}
