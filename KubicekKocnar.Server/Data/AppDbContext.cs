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
        public DbSet<Feature> Features { get; set; }
        public DbSet<Texture> Textures { get; set; }

        // items 
        public DbSet<Item> Items { get; set; }
        public DbSet<PlayerUpgrade> PlayerUpgrades { get; set; }
        public DbSet<Coinage> Coinages { get; set; }
        public DbSet<ItemUpgrade> ItemUpgrades { get; set; }

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

            modelBuilder.Entity<Game>()
                .HasOne(g => g.Author)
                .WithMany(u => u.Games)
                .HasForeignKey(g => g.UserId)
                .OnDelete(DeleteBehavior.Restrict);

            /*
            modelBuilder.Entity<Level>()
                .HasOne(l => l.Game)
                .WithMany(g => g.Levels)
                .HasForeignKey(l => l.GameId)
                .OnDelete(DeleteBehavior.Cascade);
            */

            modelBuilder.Entity<PlacedBlock>()
                .HasOne(pb => pb.Level)
                .WithMany(l => l.Blocks)
                .HasForeignKey(pb => pb.LevelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PlacedBlock>()
                .HasOne(pb => pb.Block)
                .WithMany(b => b.PlacedBlocks)
                .HasForeignKey(pb => pb.BlockId)
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Feature>()
                .HasOne(f => f.Level)
                .WithMany(l => l.Features)
                .HasForeignKey(f => f.LevelId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks0)
                .WithOne(b => b.Texture0)
                .HasForeignKey(b => b.Texture0Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks1)
                .WithOne(b => b.Texture1)
                .HasForeignKey(b => b.Texture1Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks2)
                .WithOne(b => b.Texture2)
                .HasForeignKey(b => b.Texture2Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks3)
                .WithOne(b => b.Texture3)
                .HasForeignKey(b => b.Texture3Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks4)
                .WithOne(b => b.Texture4)
                .HasForeignKey(b => b.Texture4Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Texture>()
                .HasMany(t => t.Blocks5)
                .WithOne(b => b.Texture5)
                .HasForeignKey(b => b.Texture5Id)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<Item>()
                .HasMany(i => i.Icons)
                .WithOne(t => t.Item)
                .HasForeignKey(t => t.ItemId)
                .OnDelete(DeleteBehavior.SetNull);
            

            modelBuilder.Entity<Coinage>()
                .HasOne(c => c.Icon)
                .WithMany(t => t.Coinages)
                .HasForeignKey(c => c.IconId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PlayerUpgrade>()
                .HasOne(p => p.Icon)
                .WithMany(t => t.PlayerUpgrades)
                .HasForeignKey(p => p.IconId)
                .OnDelete(DeleteBehavior.SetNull);

            modelBuilder.Entity<PlayerUpgrade>()
                .HasMany(p => p.Costs);

            modelBuilder.Entity<ItemUpgrade>()
                .HasMany(i => i.Costs);

            modelBuilder.Entity<Cost>()
                .HasOne(c => c.Coinage)
                .WithMany(c => c.Costs)
                .HasForeignKey(c => c.CoinageId)
                .OnDelete(DeleteBehavior.Cascade);
                





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
