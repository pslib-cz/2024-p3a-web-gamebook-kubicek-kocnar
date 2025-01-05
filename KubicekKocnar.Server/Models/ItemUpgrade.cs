
namespace KubicekKocnar.Server.Models
{
    public class ItemUpgrade
    {
        public uint ItemUpgradeId { get; set; }

        public Item? InputItem { get; set; }
        public uint InputItemId { get; set; }
        public Item? OutputItem { get; set; }
        public uint OutputItemId { get; set; }

        public string Description { get; set; } = "";
        public Cost[] Costs { get; set; } = [];

    }
}
