import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const BookingHistoryPage = () => {
  const [doctor, setDoctor] = useState(null);
  const [bookingHistory, setBookingHistory] = useState([]);
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem("doctor");
    if (storedDoctor) {
      const doc = JSON.parse(storedDoctor);
      setDoctor(doc);
      fetchBookingHistory(doc.doctorId);
    } else {
      navigate("/");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  const fetchBookingHistory = (doctorId) => {
    fetch(`http://localhost:5078/api/booking/history/${doctorId}`)
      .then((res) => res.json())
      .then((data) => setBookingHistory(data))
      .catch((err) => {
        console.error(err);
        setMessage("❌ Failed to load booking history.");
      });
  };

  const handleLogout = () => {
    localStorage.removeItem("doctor");
    navigate("/");
  };

  if (!doctor) return null;

  return (
    <div style={styles.page}>
      {/* Navbar */}
      <div style={styles.navbar}>
        <div style={styles.navLeft}>
          🏥 <span style={styles.navTitle}>Hospital Dashboard</span>
        </div>
        <div style={styles.navRight}>
          <span style={styles.navEmail}>{doctor.email}</span>
          <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        </div>
      </div>

      <div style={styles.contentWrapper}>
        {/* Sidebar */}
        <div style={styles.sidebar}>
          <p style={styles.sidebarTitle}>Navigation</p>
          <div style={styles.navItem} onClick={() => navigate('/intro')}>
            🏠 Dashboard
          </div>
          <div style={styles.navItem} onClick={() => navigate('/bookings')}>
            📅 Bookings
          </div>
          <div
            style={{ ...styles.navItem, ...styles.activeNavItem }}
            onClick={() => window.location.reload()}
          >
            📜 History
          </div>
          <div
            style={{ ...styles.navItem, color: '#f05454' }}
            onClick={handleLogout}
          >
            🚪 Logout
          </div>
        </div>

        {/* Main Content */}
        <div style={styles.mainContent}>
          <div style={styles.card}>
            <h2 style={styles.heading}>Booking History</h2>

            {message && <p style={styles.message}>{message}</p>}

            {bookingHistory.length === 0 ? (
              <p>No past bookings found.</p>
            ) : (
              <div style={styles.tableWrapper}>
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th>Booking ID</th>
                      <th>Date</th>
                      <th>Status</th>
                      <th>Nurses Assigned</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookingHistory.map((booking) => (
                      <tr key={booking.bookingId}>
                        <td>{booking.bookingId}</td>
                        <td>{new Date(booking.bookingDate).toLocaleString()}</td>
                        <td>{booking.status}</td>
                        <td>
                          {booking.bookingNurses && booking.bookingNurses.length > 0
                            ? booking.bookingNurses
                                .map((bn) => bn.nurse?.name || `Nurse ${bn.nurseId}`)
                                .join(", ")
                            : "No nurses"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

const styles = {
  page: {
    height: '100vh',
    display: 'flex',
    flexDirection: 'column',
    fontFamily: 'Segoe UI, sans-serif',
  },
  navbar: {
    height: '60px',
    backgroundColor: '#1a2a3a',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '0 30px',
    color: 'white',
    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
  },
  navLeft: {
    display: 'flex',
    alignItems: 'center',
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navTitle: { marginLeft: '8px' },
  navRight: { display: 'flex', alignItems: 'center', gap: '15px' },
  navEmail: { fontSize: '14px', opacity: 0.85 },
  logoutBtn: {
    padding: '8px 15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#f05454',
    color: 'white',
    cursor: 'pointer',
    fontSize: '14px',
    transition: '0.3s',
  },
  contentWrapper: { flex: 1, display: 'flex', backgroundColor: '#f0f4f8' },
  sidebar: {
    width: '220px',
    backgroundColor: '#243447',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    padding: '20px 0',
    boxShadow: '2px 0 6px rgba(0,0,0,0.15)',
  },
  sidebarTitle: {
    fontSize: '14px',
    textTransform: 'uppercase',
    opacity: 0.6,
    marginBottom: '10px',
    paddingLeft: '20px',
  },
  navItem: {
    padding: '12px 20px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  activeNavItem: { backgroundColor: '#2d5d8c' },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    width: "700px",
    padding: "30px",
    backgroundColor: "white",
    borderRadius: "12px",
    boxShadow: "0 4px 16px rgba(0,0,0,0.08)",
    border: "1px solid #e0e6ed",
  },
  heading: { color: "#2d5d8c", marginBottom: "20px", textAlign: "center" },
  message: { marginBottom: "15px", color: "#f05454", fontWeight: "bold" },
  tableWrapper: { overflowX: "auto" },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    marginTop: "10px",
  },
};

export default BookingHistoryPage;
