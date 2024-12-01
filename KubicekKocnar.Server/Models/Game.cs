using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Game
    {
        public uint GameId { get; set; }

        public required string Name { get; set; }
        public string Description { get; set; } = "";

        public User? Author { get; set; }
        public string? UserId { get; set; }

        public bool Published { get; set; }

        [JsonIgnore]
        public ICollection<Level> Levels { get; set; } = new List<Level>();
    }
}
