using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.Models
{
    public class Booking
    {
        [Key]
        public int BookingId { get; set; }
        public int DoctorId { get; set; }
        public DateTime BookingDate { get; set; } = DateTime.Now;
        public string Status { get; set; } = "Active"; // Active / Completed

        public Doctor Doctor { get; set; }
        public ICollection<BookingNurse> BookingNurses { get; set; }
    }
}
