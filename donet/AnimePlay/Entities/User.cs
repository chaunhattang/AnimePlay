using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;
// using AnimePlay.Enums; // Mở comment này khi bạn tạo thư mục Enums

namespace AnimePlay.Entities
{
    [Table("Users")]
    [Index(nameof(Username), IsUnique = true)] // Tương đương unique = true
    [Index(nameof(Email), IsUnique = true)]
    public class User
    {
        [Key]
        public string Id { get; set; } = Guid.NewGuid().ToString();

        [Required] // Tương đương nullable = false
        public string Username { get; set; } = null!;

        [Required]
        public string Password { get; set; } = null!;

        [Required]
        public string Email { get; set; } = null!;

        public string? FullName { get; set; }

        [Column(TypeName = "text")]
        public string? AvatarUrl { get; set; }

        // public RoleEnum Role { get; set; } // Cần tạo thêm file RoleEnum.cs trong thư mục Enums
        public int Role { get; set; } // Tạm thời để int, bạn sửa lại sau khi có Enum nhé
    }
}