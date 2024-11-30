namespace KubicekKocnar.Server.Models
{
    public class Game
    {
        public uint GameId { get; set; }

        public string Name { get; set; }
        public string Description { get; set; }

        public User? Author { get; set; }

        public bool Published { get; set; }

        public List<Level>? Levels { get; set; }
    }
}
