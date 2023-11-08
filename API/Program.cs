// instead of using statement there is a GlobalUsing.cs

var builder = WebApplication.CreateBuilder(args);

// Adding the service classes to the container that we usually add to the StartUp class ConfigureServices method
builder.Services.AddControllers();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v3", new OpenApiInfo { Title = "WebAPIv7", Version = "v3" });

    // configuration of swagger to be able to test with JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Jwt Auth Header",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });
    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// // before fly.io
// services.AddDbContext<StoreContext>(opts => {
//     // opts are the options given to our StoreContext
//     // opts.UseSqlite(Configuration.GetConnectionString("DefaultConnection")); // this is for sqlite
//     opts.UseNpgsql(Configuration.GetConnectionString("DefaultConnection"));
//     // Configuration is in fact our App Configuration (public IConfiguration) injected in out Startup class
//     // in fact our config is reading from the appsettings
// });

//with fly.io
// var env = Environment.GetEnvironmentVariable("ASPNETCORE_ENVIRONMENT"); // for .NET5
string connString;
if (builder.Environment.IsDevelopment()) // for .NET7
// if (env == "Development")
{
    // connString = Configuration.GetConnectionString("DefaultConnection"); // for .NET5
    connString = builder.Configuration.GetConnectionString("DefaultConnection"); // for .NET7
}
else
{
    // Use connection string provided at runtime by Flyio.
    var connUrl = Environment.GetEnvironmentVariable("DATABASE_URL");

    // Parse connection URL to connection string for Npgsql
    connUrl = connUrl.Replace("postgres://", string.Empty);
    var pgUserPass = connUrl.Split("@")[0];
    var pgHostPortDb = connUrl.Split("@")[1];
    var pgHostPort = pgHostPortDb.Split("/")[0];
    var pgDb = pgHostPortDb.Split("/")[1];
    var pgUser = pgUserPass.Split(":")[0];
    var pgPass = pgUserPass.Split(":")[1];
    var pgHost = pgHostPort.Split(":")[0];
    var pgPort = pgHostPort.Split(":")[1];

    connString = $"Server={pgHost};Port={pgPort};User Id={pgUser};Password={pgPass};Database={pgDb};";
}
// services.AddDbContext<DataContext>(opt =>
builder.Services.AddDbContext<StoreContext>(opt =>
{
    opt.UseNpgsql(connString);
});

builder.Services.AddCors();
// adding services for Identity
builder.Services.AddIdentityCore<User>(
    opt =>
    { // add options for validations here
        opt.User.RequireUniqueEmail = true; // we do not allow duplicate email
    }
)
    .AddRoles<Role>()
    .AddEntityFrameworkStores<StoreContext>(); // this provides access to UserManager class
builder.Services.AddAuthentication(
    JwtBearerDefaults.AuthenticationScheme // inside we put unstruction what authentication scheme we will use
).AddJwtBearer(
    opt =>
    {
        opt.TokenValidationParameters = new TokenValidationParameters
        {
            // how are we going to validate the token
            ValidateIssuer = false, // generally here it should be the address of the server - for instance http://localhost:5000 
            ValidateAudience = false, // generally here it should be the address client of the local host
            ValidateLifetime = true, // no validate hte exiry date
            ValidateIssuerSigningKey = true,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8
                .GetBytes(builder.Configuration["JWTSettings:TokenKey"]))
        };
    }); // authentication service should be below the Identity service (to avoid problems)
builder.Services.AddAuthorization();

// adding our own created TokenService with a lifetime of the http request
builder.Services.AddScoped<TokenService>();

// adding the Payment service creates with Stripe
builder.Services.AddScoped<PaymentService>();

// finally referencing my app via builder.Build() to return it already configured
var app = builder.Build();

//now I have to add the middlewares that were placed at the end of the Startup class inside the Configure method
app.UseMiddleware<ExceptionMiddleware>();
if (builder.Environment.IsDevelopment()) // valid only if we are in development mode //env variable in .NET5.0 Startup class is replaced by builder.Environment
{
    // app.UseDeveloperExceptionPage(); // additional information on exceptions only in dev mode, replaced by our own
    app.UseSwagger(); // middleware for swagger

    // simple swagger config
    // app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v3/swagger.json", ".NetDemo WebAPIv7 v3")); // this is for the visualization of swagger

    // swagger config with memoizing in the localStorage the last Bearer token used as Authentication
    app.UseSwaggerUI(c =>
    {
        c.SwaggerEndpoint("/swagger/v3/swagger.json", ".NetDemo WebAPIv7 v3");
        c.ConfigObject.AdditionalItems.Add("persistAuthorization", "true");
    }); // this is for the visualization of swagger
}

// app.UseHttpsRedirection(); // should be used for HTTPs redirection only in .NET5.0 way of building the API

// app.UseRouting(); // middleware for routing only in .NET5.0 way of building the API

// serving the static files from the default /wwwroot foder
// when serving content from /wwwroot folder, it is going to search for the index.html
app.UseDefaultFiles();
// using the static files in this folder /wwwroot
app.UseStaticFiles();

app.UseCors(opt =>
{
    opt.AllowAnyHeader().AllowAnyMethod().AllowCredentials().WithOrigins("http://localhost:3000");
}); // CORS should be positioned right after the Routing in order to work properly
// AllowCredentials is needed to accept cookies from this origin

app.UseAuthentication(); // we must authenticate before authorize the user, so this middleware goes above hte authorization
app.UseAuthorization(); // middleware for authorization

// app.UseEndpoints(endpoints => // middleware for the endpoints that can be used // in .NET5.0
// {
//     endpoints.MapControllers();
//     // adding what to do if it doesn't recognize the routing
//     endpoints.MapFallbackToController("Index", "Fallback");
//     // Index is the name of the action, Fallback is the name of the controller we create for this case
// });

// middleware for the endpoints that can be used // in .NET6.0
app.MapControllers();
app.MapFallbackToController("Index", "Fallback");


using var scope = app.Services.CreateScope(); // creating the scope of services / with using it collects automatically the garbage when not used
var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>(); //adding userManager class
var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>();
// logging if an error occurs during the database creation since Exceptions can be held only after the Run() command, as it i s in the Startup class

try
{
    // using await because of the UserManager => the Main void function becomes a async Task
    await context.Database.MigrateAsync(); // migrate into the database. If DB doesn't exist it creates such
    await DbInitializer.Initialize(context, userManager);
}
catch (Exception ex) // to catch the exception and set it in the ex variable
{
    logger.LogError(ex, "Problem migrating data!");
}

await app.RunAsync();

// the 40 lines below are made using the .NET5.0 way of bulding an app. It requires the existence of Startup.cs class as well
// from .Net6.0 this code is minimized using the builder variable creation
// namespace API
// {
//     public class Program
//     {
//         public static async Task Main(string[] args)
//         {
//             // normal way of running the program
//             // CreateHostBuilder(args).Build().Run(); // created Kestrel server

//             // current way of starting the program, so that is start with filling the database with fake products via DbInitializer
//             var host = CreateHostBuilder(args).Build();
//             using var scope = host.Services.CreateScope(); // creating the scope of services / with using it collects automatically the garbage when not used
//             var context = scope.ServiceProvider.GetRequiredService<StoreContext>();
//             var userManager = scope.ServiceProvider.GetRequiredService<UserManager<User>>(); //adding userManager class
//             var logger = scope.ServiceProvider.GetRequiredService<ILogger<Program>>(); 
//             // logging if an error occurs during the database creation since Exceptions can be held only after the Run() command, as it i s in the Startup class

//             try
//             {
//                 // using await because of the UserManager => the Main void function becomes a async Task
//                 await context.Database.MigrateAsync(); // migrate into the database. If DB doesn't exist it creates such
//                 await DbInitializer.Initialize(context, userManager);
//             }
//             catch (Exception ex) // to catch the exception and set it in the ex variable
//             {
//                 logger.LogError(ex, "Problem migrating data!");
//             }
//             // finally
//             // {
//             //     scope.Dispose(); // for garbage collection at the end (free up the ressources) - to be used if "scope" not created via "using" keyword; 
//             // }

//             // due to the transformation of the Main function to async Task we should use await and RunAsync versions
//             await host.RunAsync(); // starts the program with Startup class
//         }

//         public static IHostBuilder CreateHostBuilder(string[] args) =>
//             Host.CreateDefaultBuilder(args)
//                 .ConfigureWebHostDefaults(webBuilder =>
//                 {
//                     webBuilder.UseStartup<Startup>();
//                 });
//     }
// }
