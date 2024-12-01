using Microsoft.Build.Framework;
using System.ComponentModel.DataAnnotations.Schema;
using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{

    public class Feature
    {
        public uint FeatureId { get; set; }

        public double X { get; set; }
        public double Y { get; set; }
        public double Z { get; set; }

        // interpretted as an Enum clientside - no need to actually define it here
        public uint Type { get; set; }

        [JsonIgnore]
        public required Level Level { get; set; }
        public uint LevelId { get; set; }

        public required DateTime Created { get; set; } = DateTime.Now;

        public Dictionary<string, string> Params { get; set; } = new();
    }
}
