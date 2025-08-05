using HospitalManagement.Models;
using HospitalManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DoctorController : ControllerBase
    {
        private readonly DoctorService _doctorService;

        public DoctorController(DoctorService doctorService)
        {
            _doctorService = doctorService;
        }

        [HttpGet]
        public IActionResult GetAllDoctors()
        {
            return Ok(_doctorService.GetAllDoctors());
        }

        [HttpGet("{id}")]
        public IActionResult GetDoctorById(int id)
        {
            var doctor = _doctorService.GetDoctorById(id);
            if (doctor == null) return NotFound();
            return Ok(doctor);
        }

        [HttpPost]
        public IActionResult AddDoctor([FromBody] Doctor doctor)
        {
            var createdDoctor = _doctorService.AddDoctor(doctor);
            return CreatedAtAction(nameof(GetDoctorById), new { id = createdDoctor.DoctorId }, createdDoctor);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateDoctor(int id, [FromBody] Doctor doctor)
        {
            var updatedDoctor = _doctorService.UpdateDoctor(id, doctor);
            if (updatedDoctor == null) return NotFound();
            return Ok(updatedDoctor);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteDoctor(int id)
        {
            var success = _doctorService.DeleteDoctor(id);
            if (!success) return NotFound();
            return NoContent();
        }
[HttpPost("login")]
        public IActionResult Login([FromBody] LoginRequest request)
        {
            var doctor = _doctorService.GetAllDoctors()
                .FirstOrDefault(d => d.Email == request.Email && d.PasswordHash == request.Password);

            if (doctor == null)
                return Unauthorized(new { message = "Invalid email or password" });

            return Ok(new
            {
                doctor.DoctorId,
                doctor.Name,
                doctor.Email,
                 doctor.Profession
            });
        }
    }

    // DTO for login
    public class LoginRequest
    {
        public string Email { get; set; }
        public string Password { get; set; }
    }
}
