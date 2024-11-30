using KubicekKocnar.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace KubicekKocnar.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Game> Games { get; set; }

        public DbSet<Block> Blocks { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<PlacedBlock> PlacedBlocks { get; set; }
        public DbSet<Light> Lights { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Texture> Textures { get; set; }

        // Authorization
        public DbSet<User> Users { get; set; }
        public DbSet<IdentityUserClaim<string>> UserClaims { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source=app.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            var dictionaryToJsonConverter = new ValueConverter<Dictionary<string, string>, string>(
                v => JsonSerializer.Serialize(v ?? new Dictionary<string, string>(), (JsonSerializerOptions)null), // Pokud je `null`, uloží prázdný JSON
                v => string.IsNullOrEmpty(v)
                    ? new Dictionary<string, string>() // Pokud je hodnota prázdná nebo `null`, vrátí prázdný slovník
                    : JsonSerializer.Deserialize<Dictionary<string, string>>(v, (JsonSerializerOptions)null) // Jinak deserializuje
            );

            modelBuilder.Entity<Feature>()
               .Property(f => f.Params)
               .HasConversion(dictionaryToJsonConverter)
               .HasColumnType("text");

            /*var adminRoleId = Guid.NewGuid().ToString();
            var authorRoleId = Guid.NewGuid().ToString();
            modelBuilder.Entity<Models.Role>(options =>
            {
                options.HasData(
                    new Models.Role
                    {
                        Id = adminRoleId,
                        Name = Role.Admin,
                        NormalizedName = Role.Admin.ToUpper()
                    },
                    new Models.Role
                    {
                        Id = authorRoleId,
                        Name = Role.Author,
                        NormalizedName = Role.Author.ToUpper()
                    }
                );
            });

            var mainAdminId = Guid.NewGuid().ToString();
            modelBuilder.Entity<User>(entity =>
            {
                entity.HasMany(u => u.Roles).WithMany(r => r.Users).UsingEntity<IdentityUserRole<string>>();
                entity.HasData(
                    new User
                    {
                        Id = mainAdminId,
                        UserName = "admin@localhost.test",
                        NormalizedUserName = "ADMIN@LOCALHOST.TEST",
                        Email = "admin@localhost.test",
                        NormalizedEmail = "ADMIN@LOCALHOST.TEST",
                        EmailConfirmed = true,
                        PasswordHash = new PasswordHasher<User>().HashPassword(null!, "admin"),
                        SecurityStamp = string.Empty
                    }
                );
            });

            modelBuilder.Entity<IdentityUserRole<string>>(entity =>
            {
                entity.HasKey(x => new { x.RoleId, x.UserId });
                entity.HasData(
                    new IdentityUserRole<string>
                    {
                        RoleId = adminRoleId,
                        UserId = mainAdminId
                    },
                    new IdentityUserRole<string>
                    {
                        RoleId = authorRoleId,
                        UserId = mainAdminId
                    }
                );
            });*/
        }
    }
}
