﻿namespace KubicekKocnar.Server.Models
{
    public class Item
    {
        public uint ItemId { get; set; }

        public Texture? Icon { get; set; }
        public uint IconId { get; set; }

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public uint Type { get; set; }
    }
}
