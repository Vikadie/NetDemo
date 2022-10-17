using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.OpenApi.Models;

namespace API
{
    public class Startup
    {
        public Startup(IConfiguration configuration) // IConfiguration injected inside class Startup to be used in constructor of this class
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        // Often refer as Dependency Injection Container
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });
            });
            services.AddDbContext<StoreContext>(opts => {
                // opts are the options given to our StoreContext
                opts.UseSqlite(Configuration.GetConnectionString("DefaultConnection"));
                // Configuration is in fact our App Configuration (public IConfiguration) injected in out Startup class
                // in fact our config is reading from the appsettings
            });
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        // this is for the middleware to add in our application
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment()) // valid only if we are in development mode
            {
                app.UseDeveloperExceptionPage(); // additional information on exceptions
                app.UseSwagger(); // middleware for swagger
                app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", ".NetDemo WebAPIv5 v1")); // this is for the visualization of swagger
            }

            // app.UseHttpsRedirection(); // should be used for HTTPs redirection

            app.UseRouting(); // middleware for routing

            app.UseAuthorization(); // middleware for authorization

            app.UseEndpoints(endpoints => // middleware for the endpoints that can be used
            {
                endpoints.MapControllers();
            });
        }
    }
}
