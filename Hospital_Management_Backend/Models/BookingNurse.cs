using System.ComponentModel.DataAnnotations;

namespace HospitalManagement.Models
{
    public class BookingNurse
    {
        [Key]
        public int BookingNurseId { get; set; }
        public int BookingId { get; set; }
        public int NurseId { get; set; }

        public Booking Booking { get; set; }
        public Nurse Nurse { get; set; }
    }
}
