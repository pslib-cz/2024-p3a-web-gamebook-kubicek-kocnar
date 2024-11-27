using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    public enum FeatureType
    {

    }

    public class Feature
    {
        public int Id { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        public FeatureType Type { get; set; }

        public List<FeatureParams> params_ { get; set; }
}
}
