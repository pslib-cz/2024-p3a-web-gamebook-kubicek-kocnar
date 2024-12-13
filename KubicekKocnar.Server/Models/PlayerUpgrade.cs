namespace KubicekKocnar.Server.Models
{
    public class PlayerUpgrade
    {
        public uint PlayerUpgradeId { get; set; }

        public Cost[] Costs { get; set; } = [];
        public required string Name { get; set; }
        public string Description { get; set; } = "";

        public required uint outputType;
        public Texture? Icon { get; set; }
        public uint? IconId { get; set; }
    }
}
