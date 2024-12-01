using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Texture
    {
        public uint TextureId { get; set; }
        public required byte[] src { get; set; }

        [JsonIgnore]
        public ICollection<Block>? Blocks0 { get; set; }
        [JsonIgnore]
        public ICollection<Block>? Blocks1 { get; set; }
        [JsonIgnore]
        public ICollection<Block>? Blocks2 { get; set; }
        [JsonIgnore]
        public ICollection<Block>? Blocks3 { get; set; }
        [JsonIgnore]
        public ICollection<Block>? Blocks4 { get; set; }
        [JsonIgnore]
        public ICollection<Block>? Blocks5 { get; set; }
    }
}
