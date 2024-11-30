using System.Text.Json.Serialization;

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
        

        public ICollection<PlacedBlock> Blocks { get; set; } = new List<PlacedBlock>();

        public ICollection<Feature> Features { get; set; } = new List<Feature>();
    }
}
