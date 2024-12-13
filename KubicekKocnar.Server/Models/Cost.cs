namespace KubicekKocnar.Server.Models {
    public class Cost {
        public uint CostId { get; set; }
        public uint Count { get; set; }
        public Coinage? Coinage { get; set; }
        public uint CoinageId { get; set; }
    }
}
