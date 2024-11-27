using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{

    public class Feature
    {
        public uint FeatureId { get; set; }

        public int X { get; set; }
        public int Y { get; set; }
        public int Z { get; set; }

        // interpretted as an Enum clientside - no need to actually define it here
        public uint Type { get; set; }

        public List<FeatureParams> params_ { get; set; } = [];
}
}
