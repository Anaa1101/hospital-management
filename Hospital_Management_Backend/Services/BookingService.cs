using HospitalManagement.Data;
using HospitalManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.Services
{
    public class BookingService
    {
        private readonly AppDbContext _context;

        public BookingService(AppDbContext context)
        {
            _context = context;
        }

        // ---------------- Core booking methods ----------------

        public Booking CreateBooking(int doctorId, List<int> nurseIds)
        {
            if (nurseIds.Count > 4)
                throw new Exception("A doctor can only book up to 4 nurses.");

            // Validate that all nurses exist and are available
            var nursesToAssign = _context.Nurses.Where(n => nurseIds.Contains(n.NurseId)).ToList();
            
            if (nursesToAssign.Count != nurseIds.Count)
                throw new Exception("One or more nurses not found.");

            var unavailableNurses = nursesToAssign.Where(n => n.Status != "Available").ToList();
            if (unavailableNurses.Any())
                throw new Exception($"The following nurses are not available: {string.Join(", ", unavailableNurses.Select(n => n.Name))}");

            // 1️⃣ Complete old bookings and free nurses
            var oldBookings = _context.Bookings
                .Where(b => b.DoctorId == doctorId && b.Status == "Active")
                .Include(b => b.BookingNurses)
                .ToList();

            foreach (var oldBooking in oldBookings)
            {
                oldBooking.Status = "Completed";

                foreach (var bn in oldBooking.BookingNurses)
                {
                    var nurse = _context.Nurses.Find(bn.NurseId);
                    if (nurse != null) nurse.Status = "Available";
                }
            }

            // 2️⃣ Create new booking
            var newBooking = new Booking
            {
                DoctorId = doctorId,
                BookingDate = DateTime.UtcNow,
                Status = "Active"
            };
            _context.Bookings.Add(newBooking);
            _context.SaveChanges(); // Save to get BookingId

            // 3️⃣ Assign nurses
            foreach (var nurseId in nurseIds)
            {
                _context.BookingNurses.Add(new BookingNurse
                {
                    BookingId = newBooking.BookingId,
                    NurseId = nurseId
                });

                var nurse = _context.Nurses.Find(nurseId);
                if (nurse != null) nurse.Status = "Assigned";
            }

            _context.SaveChanges();
            return newBooking;
        }

        public List<Booking> GetCurrentBookings(int doctorId)
        {
            return _context.Bookings
                .Where(b => b.DoctorId == doctorId && b.Status == "Active")
                .Include(b => b.BookingNurses)
                .ThenInclude(bn => bn.Nurse)
                .ToList();
        }

        public List<Booking> GetBookingHistory(int doctorId)
        {
            return _context.Bookings
                .Where(b => b.DoctorId == doctorId)
                .Include(b => b.BookingNurses)
                .ThenInclude(bn => bn.Nurse)
                .OrderByDescending(b => b.BookingDate)
                .ToList();
        }

        // ---------------- Frontend helper methods ----------------

        // 1️⃣ Get all nurses (for dropdown) - only show available ones
        public List<Nurse> GetAllNurses()
        {
            return _context.Nurses
                .Where(n => n.Status == "Available")
                .OrderBy(n => n.Name)
                .ToList();
        }

        // 2️⃣ Get active nurses currently assigned to a doctor
        public List<Nurse> GetActiveNursesForDoctor(int doctorId)
        {
            return _context.BookingNurses
                .Include(bn => bn.Nurse)
                .Include(bn => bn.Booking)
                .Where(bn => bn.Booking.DoctorId == doctorId && bn.Booking.Status == "Active")
                .Select(bn => bn.Nurse)
                .Distinct()
                .OrderBy(n => n.Name)
                .ToList();
        }

        // 3️⃣ Discharge a nurse and mark them available
        public bool DischargeNurse(int nurseId)
        {
            var bookingNurse = _context.BookingNurses
                .Include(bn => bn.Booking)
                .FirstOrDefault(bn => bn.NurseId == nurseId && bn.Booking.Status == "Active");

            if (bookingNurse == null)
                return false;

            // 1️⃣ Mark nurse available
            var nurse = _context.Nurses.Find(nurseId);
            if (nurse != null) nurse.Status = "Available";

            // 2️⃣ Remove nurse from booking
            var bookingId = bookingNurse.BookingId;
            _context.BookingNurses.Remove(bookingNurse);
            _context.SaveChanges();

            // 3️⃣ Check if booking now has zero nurses → mark Completed
            bool noNursesLeft = !_context.BookingNurses.Any(bn => bn.BookingId == bookingId);
            if (noNursesLeft)
            {
                var booking = _context.Bookings.Find(bookingId);
                if (booking != null)
                {
                    booking.Status = "Completed";
                    _context.SaveChanges();
                }
            }

            return true;
        }

        // 4️⃣ Additional helper method to get all nurses including assigned ones (for admin purposes)
        public List<Nurse> GetAllNursesWithStatus()
        {
            return _context.Nurses
                .OrderBy(n => n.Name)
                .ToList();
        }

        // 5️⃣ Check if a nurse is available
        public bool IsNurseAvailable(int nurseId)
        {
            var nurse = _context.Nurses.Find(nurseId);
            return nurse != null && nurse.Status == "Available";
        }
    }
}