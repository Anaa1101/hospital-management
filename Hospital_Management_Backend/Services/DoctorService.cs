using HospitalManagement.Data;
using HospitalManagement.Models;

namespace HospitalManagement.Services
{
    public class DoctorService
    {
        private readonly AppDbContext _context;

        public DoctorService(AppDbContext context)
        {
            _context = context;
        }

        public IEnumerable<Doctor> GetAllDoctors() => _context.Doctors.ToList();

        public Doctor? GetDoctorById(int id) => _context.Doctors.Find(id);

        public Doctor AddDoctor(Doctor doctor)
        {
            _context.Doctors.Add(doctor);
            _context.SaveChanges();
            return doctor;
        }

        public Doctor? UpdateDoctor(int id, Doctor doctor)
        {
            var existing = _context.Doctors.Find(id);
            if (existing == null) return null;

            existing.Name = doctor.Name;
            existing.Email = doctor.Email;
            existing.PasswordHash = doctor.PasswordHash; // ✅ FIX

            _context.SaveChanges();
            return existing;
        }

        public bool DeleteDoctor(int id)
        {
            var doctor = _context.Doctors.Find(id);
            if (doctor == null) return false;

            _context.Doctors.Remove(doctor);
            _context.SaveChanges();
            return true;
        }
    }
}
