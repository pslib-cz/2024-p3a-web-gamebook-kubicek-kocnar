using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    public class PlacedBlock
    {
        public uint PlacedBlockId { get; set; }

        public uint? Block { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }
    }
}
