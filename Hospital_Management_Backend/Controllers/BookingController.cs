using HospitalManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BookingController : ControllerBase
    {
        private readonly BookingService _bookingService;

        public BookingController(BookingService bookingService)
        {
            _bookingService = bookingService;
        }

        /// <summary>
        /// Create a new booking for a doctor with a list of nurse IDs.
        /// </summary>
        [HttpPost("{doctorId}")]
        public IActionResult CreateBooking(int doctorId, [FromBody] List<int> nurseIds)
        {
            if (nurseIds == null || !nurseIds.Any())
                return BadRequest("Please provide at least one nurse ID.");

            try
            {
                var booking = _bookingService.CreateBooking(doctorId, nurseIds);
                return Ok(booking);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        /// <summary>
        /// Get all current/active nurses assigned to a doctor.
        /// </summary>
        [HttpGet("current/{doctorId}")]
        public IActionResult GetCurrentBookings(int doctorId)
        {
            // Return the list of nurses currently assigned to the doctor
            var nurses = _bookingService.GetActiveNursesForDoctor(doctorId);
            return Ok(nurses);
        }

        /// <summary>
        /// Get the full booking history for a doctor.
        /// </summary>
        [HttpGet("history/{doctorId}")]
        public IActionResult GetBookingHistory(int doctorId)
        {
            var bookings = _bookingService.GetBookingHistory(doctorId);
            return Ok(bookings);
        }

        /// <summary>
        /// Get all nurses for selection in booking.
        /// </summary>
        [HttpGet("nurses")]
        public IActionResult GetAllNurses()
        {
            var nurses = _bookingService.GetAllNurses();
            return Ok(nurses);
        }

        /// <summary>
        /// Discharge a nurse from their current active booking.
        /// </summary>
        [HttpPut("nurse/discharge/{nurseId}")]
        public IActionResult DischargeNurse(int nurseId)
        {
            var result = _bookingService.DischargeNurse(nurseId);
            if (!result)
                return NotFound($"Nurse with ID {nurseId} is not currently assigned.");

            return Ok(new { message = $"Nurse {nurseId} discharged successfully" });
        }
    }
}