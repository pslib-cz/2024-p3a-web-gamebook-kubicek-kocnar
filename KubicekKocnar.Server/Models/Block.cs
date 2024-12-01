using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Block
    {
        public uint BlockId { get; set; }

        public required string Name { get; set; }

        public uint? Texture0Id { get; set; }
        public Texture? Texture0 { get; set; }
        public uint? Texture1Id { get; set; }
        public Texture? Texture1 { get; set; }
        public uint? Texture2Id { get; set; }
        public Texture? Texture2 { get; set; }
        public uint? Texture3Id { get; set; }
        public Texture? Texture3 { get; set; }
        public uint? Texture4Id { get; set; }
        public Texture? Texture4 { get; set; }
        public uint? Texture5Id { get; set; }
        public Texture? Texture5 { get; set; }

        public required string Attributes { get; set; } = "";

        [JsonIgnore]
        public ICollection<PlacedBlock> PlacedBlocks { get; set; } = [];

    }
}
