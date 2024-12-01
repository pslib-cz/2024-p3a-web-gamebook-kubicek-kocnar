using Microsoft.AspNetCore.Identity;
using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations.Schema;

namespace KubicekKocnar.Server.Models
{
    [Table("AspNetRoles")]
    public class Role : IdentityRole<string>
    {
        [JsonIgnore]
        public ICollection<User>? Users { get; set; }
    }
}
