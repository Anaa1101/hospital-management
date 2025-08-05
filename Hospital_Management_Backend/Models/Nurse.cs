using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.Models
{
    public class Nurse
    {
        [Key]
        public int NurseId { get; set; }
        [Required] public string Name { get; set; }
        public string Status { get; set; } = "Available"; // Available / Assigned

        public ICollection<BookingNurse> BookingNurses { get; set; }
    }
}
