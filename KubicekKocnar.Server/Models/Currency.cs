namespace KubicekKocnar.Server.Models
{
    public class Currency
    {
        public uint CurrencyId { get; set; }

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";

        public required Texture icon { get; set; }
        public uint IconId { get; set; }
    }
}
