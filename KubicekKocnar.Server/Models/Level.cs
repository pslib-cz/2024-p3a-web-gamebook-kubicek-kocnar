namespace KubicekKocnar.Server.Models
{
    public class Level
    {
        public uint LevelId { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public uint? NextLevelId { get; set; }

        public Game? Game { get; set; }

        public List<PlacedBlock>? Blocks { get; set; }

        public List<Light>? Lights { get; set; }

        public List<Feature>? Features { get; set; }
    }
}
