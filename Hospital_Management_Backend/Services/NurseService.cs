using HospitalManagement.Data;
using HospitalManagement.Models;

namespace HospitalManagement.Services
{
    public class NurseService
    {
        private readonly AppDbContext _context;

        public NurseService(AppDbContext context)
        {
            _context = context;
        }

        // Get all nurses
        public List<Nurse> GetAllNurses()
        {
            return _context.Nurses.ToList();
        }

        // Get nurse by id
        public Nurse? GetNurseById(int id)
        {
            return _context.Nurses.FirstOrDefault(n => n.NurseId == id);
        }

        // Add new nurse
        public Nurse AddNurse(Nurse nurse)
        {
            _context.Nurses.Add(nurse);
            _context.SaveChanges();
            return nurse;
        }

        // Update nurse
        public Nurse? UpdateNurse(int id, Nurse updatedNurse)
        {
            var nurse = _context.Nurses.Find(id);
            if (nurse == null) return null;

            nurse.Name = updatedNurse.Name;
            nurse.Status = updatedNurse.Status;

            _context.SaveChanges();
            return nurse;
        }

        // Delete nurse
        public bool DeleteNurse(int id)
        {
            var nurse = _context.Nurses.Find(id);
            if (nurse == null) return false;

            _context.Nurses.Remove(nurse);
            _context.SaveChanges();
            return true;
        }

        // Get available nurses
        public List<Nurse> GetAvailableNurses()
        {
            return _context.Nurses
                           .Where(n => n.Status == "Available")
                           .ToList();
        }
    }
}
