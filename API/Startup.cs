using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Middleware;
using API.Services;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;

// this StartUp class is used when implicitly using the .Net5.0 way of building an app.
// in .Net6.0+ this is not needed
namespace API
{
    // public class Startup
    // {
    //     public Startup(IConfiguration configuration) // IConfiguration injected inside class Startup to be used in constructor of this class
    //     {
    //         Configuration = configuration;
    //     }

    //     public IConfiguration Configuration { get; }

    //     // This method gets called by the runtime. Use this method to add services to the container.
    //     // Often refer as Dependency Injection Container
    //     public void ConfigureServices(IServiceCollection services)
    //     {

    //         services.AddControllers();
    //         services.AddSwaggerGen(c =>
    //         {
    //             c.SwaggerDoc("v1", new OpenApiInfo { Title = "WebAPIv5", Version = "v1" });

    //             // configuration of swagger to be able to test with JWT
    //             c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    //             {
    //                 Description = "Jwt Auth Header",
    //                 Name = "Authorization",
    //                 In = ParameterLocation.Header,
    //                 Type = SecuritySchemeType.ApiKey,
    //                 Scheme = "Bearer"
    //             });
    //             c.AddSecurityRequirement(new OpenApiSecurityRequirement
    //             {
    //                 {
    //                     new OpenApiSecurityScheme
    //                     {
    //                         Reference = new OpenApiReference
    //                         {
    //                             Type = ReferenceType.SecurityScheme,
    //                             Id = "Bearer"
    //                         },
    //                         Scheme = "oauth2",
    //                         Name = "Bearer",
    //                         In = ParameterLocation.Header
    //                     },
    //                     new List<string>()
    //                 }
    //             });
    //         });

    //         // // before fly.io
    //         // services.AddDbContext<StoreContext>(opts => {
    //         //     // opts are the options given to our StoreContext
    //         //     // opts.UseSqlite(Configuration.GetConnectionString("DefaultConnection")); // this is for sqlite
    //         //     opts.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
    //         //     // Configuration is in fact our App Configuration (public IConfiguration) injected in out Startup class
    //         //     // in fact our config is reading from the appsettings
    //         // });

    //         //with fly.io
    //         var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"); // for .NET5
    //         string connString;
    //         // if (Environment.IsDevelopment()) // for .NET7
    //         if (env == "Development")
    //             connString = Configuration.GetConnectionString("DefaultConnection"); // for .NET5
    //                                                                                  // connString = builder.Configuration.GetConnectionString("DefaultConnection"); // for .NET7
    //         else
    //         {
    //             // Use connection string provided at runtime by Flyio.
    //             var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    //             // Parse connection URL to connection string for Npgsql
    //             connUrl = connUrl.Replace("postgres://", string.Empty);
    //             var pgUserPass = connUrl.Split("@")[0];
    //             var pgHostPortDb = connUrl.Split("@")[1];
    //             var pgHostPort = pgHostPortDb.Split("/")[0];
    //             var pgDb = pgHostPortDb.Split("/")[1];
    //             var pgUser = pgUserPass.Split(":")[0];
    //             var pgPass = pgUserPass.Split(":")[1];
    //             var pgHost = pgHostPort.Split(":")[0];
    //             var pgPort = pgHostPort.Split(":")[1];

    //             connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
    //         }
    //         // services.AddDbContext<DataContext>(opt =>
    //         services.AddDbContext<StoreContext>(opt =>
    //         {
    //             opt.UseNpgsql(connString);
    //         });

    //         services.AddCors();
    //         // adding services for Identity
    //         services.AddIdentityCore<User>(
    //             opt =>
    //             { // add options for validations here
    //                 opt.User.RequireUniqueEmail = true; // we do not allow duplicate email
    //             }
    //         )
    //             .AddRoles<Role>()
    //             .AddEntityFrameworkStores<StoreContext>(); // this provides access to UserManager class
    //         services.AddAuthentication(
    //             JwtBearerDefaults.AuthenticationScheme // inside we put unstruction what authentication scheme we will use
    //         ).AddJwtBearer(
    //             opt =>
    //             {
    //                 opt.TokenValidationParameters = new TokenValidationParameters
    //                 {
    //                     // how are we going to validate the token
    //                     ValidateIssuer = false, // generally here it should be the address of the server - for instance http://localhost:5000 
    //                     ValidateAudience = false, // generally here it should be the address client of the local host
    //                     ValidateLifetime = true, // no validate hte exiry date
    //                     ValidateIssuerSigningKey = true,
    //                     IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
    //                         .GetBytes(Configuration["JWTSettings:TokenKey"]))
    //                 };
    //             }); // authentication service should be below the Identity service (to avoid problems)
    //         services.AddAuthorization();

    //         // adding our own created TokenService with a lifetime of the http request
    //         services.AddScoped<TokenService>();

    //         // adding the Payment service creates with Stripe
    //         services.AddScoped<PaymentService>();
    //     }

    //     // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
    //     // this is for the middleware to add in our application
    //     public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
    //     {
    //         app.UseMiddleware<ExceptionMiddleware>();
    //         if (env.IsDevelopment()) // valid only if we are in development mode
    //         {
    //             // app.UseDeveloperExceptionPage(); // additional information on exceptions only in dev mode, replaced by our own
    //             app.UseSwagger(); // middleware for swagger
    //             app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", ".NetDemo WebAPIv5 v1")); // this is for the visualization of swagger
    //         }

    //         // app.UseHttpsRedirection(); // should be used for HTTPs redirection

    //         app.UseRouting(); // middleware for routing

    //         // serving the static files from the default /wwwroot foder
    //         // when serving content from /wwwroot folder, it is going to search for the index.html
    //         app.UseDefaultFiles();
    //         // using the static files in this folder /wwwroot
    //         app.UseStaticFiles();

    //         app.UseCors(opt =>
    //         {
    //             opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
    //         }); // CORS should be positioned right after the Routing in order to work properly
    //         // AllowCredentials is needed to accept cookies from this origin

    //         app.UseAuthentication(); // we must authenticate before authorize the user, so this middleware goes above hte authorization
    //         app.UseAuthorization(); // middleware for authorization

    //         app.UseEndpoints(endpoints => // middleware for the endpoints that can be used
    //         {
    //             endpoints.MapControllers();
    //             // adding what to do if it doesn't recognize the routing
    //             endpoints.MapFallbackToController("Index", "Fallback");
    //             // Index is the name of the action, Fallback is the name of the controller we create for this case
    //         });
    //     }
    // }
}
