using KubicekKocnar.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace KubicekKocnar.Server.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<Block> Blocks { get; set; }
        public DbSet<Level> Levels { get; set; }
        public DbSet<PlacedBlock> PlacedBlocks { get; set; }
        public DbSet<Light> Lights { get; set; }
        public DbSet<FeatureParams> FeatureParams { get; set; }
        public DbSet<Feature> Features { get; set; }
        public DbSet<Texture> Textures { get; set; }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            base.OnConfiguring(optionsBuilder);
            optionsBuilder.UseSqlite("Data Source=app.db");
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            
        }
    }
}
