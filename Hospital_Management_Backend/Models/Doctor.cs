using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.Models
{
    public class Doctor
    {
        [Key]
        public int DoctorId { get; set; }
        [Required] public string Name { get; set; }
        [Required, EmailAddress] public string Email { get; set; }
        [Required] public string PasswordHash { get; set; }

          [Required] public string Profession { get; set; }

        public ICollection<Booking> Bookings { get; set; }
    }
}
