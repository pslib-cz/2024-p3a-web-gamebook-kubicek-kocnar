﻿namespace KubicekKocnar.Server.Models
{
    public class Texture
    {
        public uint TextureId { get; set; }

        public required byte[] src { get; set; }
    }
}
