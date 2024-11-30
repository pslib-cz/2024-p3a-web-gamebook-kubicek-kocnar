namespace KubicekKocnar.Server.Models
{
    public class Game
    {
        public uint GameId { get; set; }

        public required string Name { get; set; }
        public string Description { get; set; } = "";

        public User? Author { get; set; }
        public uint? AuthorId { get; set; }

        public bool Published { get; set; }

        public required ICollection<Level> Levels { get; set; }
    }
}
