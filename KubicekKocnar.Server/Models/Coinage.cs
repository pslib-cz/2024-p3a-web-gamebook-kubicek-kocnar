using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Coinage
    {
        public uint CoinageId { get; set; }

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        public Texture? Icon { get; set; }
        public uint? IconId { get; set; }

        [JsonIgnore]
        public Cost[] Costs { get; set; } = [];
    }
}
