namespace KubicekKocnar.Server.Models
{
    public class Level
    {
        public uint LevelId { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public uint? NextLevelId { get; set; }

        public List<PlacedBlock>? Blocks { get; set; }

        public List<Light>? Lights { get; set; }
    }
}
