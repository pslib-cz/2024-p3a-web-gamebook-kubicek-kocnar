using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    public class PlacedBlock
    {
        public uint PlacedBlockId { get; set; }

        public uint? Block { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }
    }
}
