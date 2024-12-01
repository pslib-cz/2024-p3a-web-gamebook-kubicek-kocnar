using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    [Table("AspNetUsers")]
    public class User : IdentityUser<string>
    {
        public override string Id { get; set; } = Guid.NewGuid().ToString();

        public ICollection<Role>? Roles { get; set; }

        [JsonIgnore]
        public ICollection<Game>? Games { get; set; }
    }
}
