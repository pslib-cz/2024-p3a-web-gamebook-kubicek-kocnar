using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KubicekKocnar.Server.Models
{
    public class PlacedBlock
    {
        public uint PlacedBlockId { get; set; }

        public Block? Block { get; set; }
        public required uint BlockId { get; set; }

        [JsonIgnore]
        public Level ?Level { get; set; }
        public required uint LevelId { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
    }
}
