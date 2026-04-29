using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace AnimePlay.Entities
{
    [Table("Animes")]
    public class Anime
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }

        public string? Title { get; set; }

        [Column(TypeName = "text")] 
        public string? Description { get; set; }

        public string? Year { get; set; }

        public string? Genre { get; set; }

        public string? PosterUrl { get; set; }

        public string? TrailerUrl { get; set; }
    }
}