namespace KubicekKocnar.Server.Models
{
    public class Level
    {
        public uint LevelId { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public uint? NextLevelId { get; set; }

        public Game? Game { get; set; }
        public uint? GameId { get; set; }

        public required ICollection<PlacedBlock> Blocks { get; set; }

        public required ICollection<Feature> Features { get; set; }
    }
}
