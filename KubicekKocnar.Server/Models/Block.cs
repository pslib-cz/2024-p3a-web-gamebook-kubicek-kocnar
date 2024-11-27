namespace KubicekKocnar.Server.Models
{
    public class Block
    {
        public uint BlockId { get; set; }

        public required string Name { get; set; }

        public uint? Texture0 { get; set; }
        public uint? Texture1 { get; set; }
        public uint? Texture2 { get; set; }
        public uint? Texture3 { get; set; }
        public uint? Texture4 { get; set; }
        public uint? Texture5 { get; set; }

        public string Attributes { get; set; } = "";
    }
}
