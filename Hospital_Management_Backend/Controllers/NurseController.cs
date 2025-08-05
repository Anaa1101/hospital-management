using HospitalManagement.Models;
using HospitalManagement.Services;
using Microsoft.AspNetCore.Mvc;

namespace HospitalManagement.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class NurseController : ControllerBase
    {
        private readonly NurseService _nurseService;

        public NurseController(NurseService nurseService)
        {
            _nurseService = nurseService;
        }

        [HttpGet]
        public IActionResult GetAllNurses() => Ok(_nurseService.GetAllNurses());

        [HttpGet("{id}")]
        public IActionResult GetNurseById(int id)
        {
            var nurse = _nurseService.GetNurseById(id);
            if (nurse == null) return NotFound();
            return Ok(nurse);
        }

        [HttpPost]
        public IActionResult AddNurse([FromBody] Nurse nurse)
        {
            var createdNurse = _nurseService.AddNurse(nurse);
            return CreatedAtAction(nameof(GetNurseById), new { id = createdNurse.NurseId }, createdNurse);
        }

        [HttpPut("{id}")]
        public IActionResult UpdateNurse(int id, [FromBody] Nurse nurse)
        {
            var updated = _nurseService.UpdateNurse(id, nurse);
            if (updated == null) return NotFound();
            return Ok(updated);
        }

        [HttpDelete("{id}")]
        public IActionResult DeleteNurse(int id)
        {
            var success = _nurseService.DeleteNurse(id);
            return success ? NoContent() : NotFound();
        }

        [HttpGet("available")]
        public IActionResult GetAvailableNurses() => Ok(_nurseService.GetAvailableNurses());
    }
}
