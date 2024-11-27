using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    public class Light
    {
        public int Id { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public string color { get; set; }

        public float intensity { get; set; }
    }
}
