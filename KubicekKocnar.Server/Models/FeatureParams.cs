namespace KubicekKocnar.Server.Models
{
    public class FeatureParams
    {
        public uint FeatureId { get; set; }

        public required string Key { get; set; }

        public string Value { get; set; } = "";
    }
}
