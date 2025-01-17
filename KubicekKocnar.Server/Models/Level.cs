using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Level
    {
        public uint LevelId { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public uint? NextLevelId { get; set; }

        [JsonIgnore]
        public Game? Game { get; set; } = null;
        
        public uint GameId { get; set; }

        public required DateTime Created { get; set; } = DateTime.Now;

        public ICollection<PlacedBlock> Blocks { get; set; } = new List<PlacedBlock>();

        public ICollection<Feature> Features { get; set; } = new List<Feature>();

        public ICollection<Enemy> Enemies { get; set; } = new List<Enemy>();
    }
}
