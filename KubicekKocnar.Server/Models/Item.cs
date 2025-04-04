﻿using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Item
    {
        public uint ItemId { get; set; }
        [JsonIgnore]
        public Texture[] Icons { get; set; } = [];

        public string Name { get; set; } = "";
        public string Description { get; set; } = "";
        public uint Type { get; set; }
    }
}
