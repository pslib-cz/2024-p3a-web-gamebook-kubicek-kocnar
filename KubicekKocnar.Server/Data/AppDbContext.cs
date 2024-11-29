using KubicekKocnar.Server.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Storage.ValueConversion;
using System.Text.Json;

namespace KubicekKocnar.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Block> Blocks { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<PlacedBlock> PlacedBlocks { get; set; }
        public DbSet<Light> Lights { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Texture> Textures { get; set; }

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
        }
    }
}
