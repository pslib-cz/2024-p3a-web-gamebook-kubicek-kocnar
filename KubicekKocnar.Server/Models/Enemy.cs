﻿using Newtonsoft.Json;

namespace KubicekKocnar.Server.Models
{
    public class Enemy
    {
        public uint EnemyId { get; set; }

        public string Name { get; set; } = "";

        public float Health { get; set; }
        public float Damage { get; set; }
        public float AttackSpeed { get; set; }
        public float Speed { get; set; }

        public bool IsGhost { get; set; }

        public Cost[] Reward { get; set; } = [];

        [JsonIgnore]
        public Texture? Texture { get; set; }
        public uint TextureId { get; set; }

        [JsonIgnore]
        public List<Level> Levels { get; set; } = [];
    }
}
