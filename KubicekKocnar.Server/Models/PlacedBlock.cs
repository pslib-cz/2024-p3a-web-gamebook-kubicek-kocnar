using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace KubicekKocnar.Server.Models
{
    public class PlacedBlock
    {
        public uint PlacedBlockId { get; set; }

        public required Block Block { get; set; }
        public uint BlockId { get; set; }

        [JsonIgnore]
        public required Level Level { get; set; }
        public uint LevelId { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
    }
}
