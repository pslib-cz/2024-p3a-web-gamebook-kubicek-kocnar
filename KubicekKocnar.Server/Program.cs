using KubicekKocnar.Server.Data;
using KubicekKocnar.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

// CORS
builder.Services.AddCors(options =>
    options.AddDefaultPolicy(builder =>
    {
        builder.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin =>
            new Uri(origin).IsLoopback
        );
    })
);

builder.Services.AddDbContext<AppDbContext>(options => options.UseSqlite("Data Source=app.db"));

builder.Services.AddControllers()
    .AddNewtonsoftJson(options =>
        options.SerializerSettings.ReferenceLoopHandling = Newtonsoft.Json.ReferenceLoopHandling.Ignore)
    .AddJsonOptions(options =>
        options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles);
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "My API", Version = "v1" });

    // Nastavení pro JWT
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {   
        Name = "Authorization",
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Zadej token ve formátu: Bearer {token}"
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
                }
            },
            new string[] {}
        }
    });
});

// Authorization
builder.Services.AddAuthorization(options =>
{
    options.AddPolicy(Policy.Admin, policy => policy.RequireRole(Role.Admin));
    options.AddPolicy(Policy.Author, policy => policy.RequireRole(Role.Author));
});

builder.Services.AddIdentityApiEndpoints<User>(options =>
{
    options.User.RequireUniqueEmail = true;
    options.SignIn.RequireConfirmedAccount = false;
    options.Password.RequireDigit = false;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
    options.Password.RequiredLength = 1;
}).AddEntityFrameworkStores<AppDbContext>();

var app = builder.Build();

// CORS
app.UseCors(x =>
    x.AllowAnyMethod().AllowAnyHeader().SetIsOriginAllowed(origin =>
        new Uri(origin).IsLoopback
    )
);

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapGroup("/api/account").MapIdentityApi<User>();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();


public static class Policy
{
    public const string Admin = "Admin";
    public const string Author = "Author";
}

public static class Role
{
    public const string Admin = "Admin";
    public const string Author = "Author";
}