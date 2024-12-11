
namespace KubicekKocnar.Server.Models
{
    public class ItemRecipe
    {
        public uint ItemRecipeId { get; set; }

        public required Item[] inputItems { get; set; }
        public required uint[] inputQuantities { get; set; }

        public required Item outputItem { get; set; }
        public required uint outputQuantity { get; set; }

        public string Description { get; set; } = "";

    }
}
