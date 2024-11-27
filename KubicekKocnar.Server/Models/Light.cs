using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    public class Light
    {
        public int LightId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public uint Color { get; set; } = 0xffffff;

        public double Intensity { get; set; } = 1;
    }
}
