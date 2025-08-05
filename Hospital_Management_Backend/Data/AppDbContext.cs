using HospitalManagement.Models;
using Microsoft.EntityFrameworkCore;

namespace HospitalManagement.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) {}

        public DbSet<Doctor> Doctors { get; set; }
        public DbSet<Nurse> Nurses { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<BookingNurse> BookingNurses { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            // Doctor -> Booking
            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Doctor)
                .WithMany(d => d.Bookings)
                .HasForeignKey(b => b.DoctorId);

            // Booking <-> BookingNurse
            modelBuilder.Entity<BookingNurse>()
                .HasOne(bn => bn.Booking)
                .WithMany(b => b.BookingNurses)
                .HasForeignKey(bn => bn.BookingId);

            // Nurse <-> BookingNurse
            modelBuilder.Entity<BookingNurse>()
                .HasOne(bn => bn.Nurse)
                .WithMany(n => n.BookingNurses)
                .HasForeignKey(bn => bn.NurseId);
        }
    }
}
