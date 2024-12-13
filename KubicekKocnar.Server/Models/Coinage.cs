namespace KubicekKocnar.Server.Models
{
    public class Coinage
    {
        public uint CoinageId { get; set; }

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        public Texture? Icon { get; set; }
        public required uint IconId { get; set; }

        public Cost[] Costs { get; set; } = [];
    }
}
