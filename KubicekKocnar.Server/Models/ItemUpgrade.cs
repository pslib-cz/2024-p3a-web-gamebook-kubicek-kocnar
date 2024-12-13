
namespace KubicekKocnar.Server.Models
{
    public class ItemUpgrade
    {
        public uint ItemUpgradeId { get; set; }

        public required Item inputItem { get; set; }
        public required Item outputItem { get; set; }
        public string Description { get; set; } = "";
        public Cost[] Costs { get; set; } = [];

    }
}
