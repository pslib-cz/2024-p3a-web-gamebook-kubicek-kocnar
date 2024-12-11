namespace KubicekKocnar.Server.Models
{
    public class Upgrade
    {
        public uint UpgradeId { get; set; }

        public required Item[] inputItems { get; set; }
        public required uint[] inputQuantities { get; set; }

        public uint outputType;
    }
}
