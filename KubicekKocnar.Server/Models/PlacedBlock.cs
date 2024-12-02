using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class PlacedBlock
    {
        public uint PlacedBlockId { get; set; }

        public Block? Block { get; set; }
        public required uint BlockId { get; set; }

        [JsonIgnore]
        public Level? Level { get; set; }
        public required uint LevelId { get; set; }

        public required DateTime Created { get; set; } = DateTime.Now;

        public required string State { get; set; } = "";

        public required double X { get; set; }
        public required double Y { get; set; }
        public required double Z { get; set; }
    }
}
