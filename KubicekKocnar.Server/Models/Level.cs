namespace KubicekKocnar.Server.Models
{
    public class Level
    {
        public int Id { get; set; }

        public required string Name { get; set; }

        public string? Description { get; set; }

        public Level? NextLevel { get; set; }

        public List<PlacedBlock>? Blocks { get; set; }

        public List<Light>? Lights { get; set; }
    }
}
