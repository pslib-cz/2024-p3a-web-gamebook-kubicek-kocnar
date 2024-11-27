namespace KubicekKocnar.Server.Models
{
    public class FeatureParams
    {
        public uint Id { get; set; }

        public required string Key { get; set; }

        public string Value { get; set; } = "";
    }
}
