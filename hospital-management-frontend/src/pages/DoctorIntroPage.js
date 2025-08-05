import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const DoctorIntroPage = () => {
  const [doctor, setDoctor] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedDoctor = localStorage.getItem('doctor');
    if (storedDoctor) {
      setDoctor(JSON.parse(storedDoctor));
    } else {
      navigate('/');
    }
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('doctor');
    navigate('/');
  };
 

  if (!doctor) return null; // Avoid flash

  return (
    <div style={styles.page}>
      {/* Top Navbar */}
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
          <div
            style={{ ...styles.navItem, ...styles.activeNavItem }}
            onClick={() => window.location.reload()} // refresh same page
          >
            🏠 Dashboard
          </div>
          <div style={styles.navItem} onClick={() => navigate('/bookings')}>📅 Bookings</div>
          
          <div style={styles.navItem} onClick={() => navigate('/history')}>📜 History</div>
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
            <h2 style={styles.heading}>Welcome, {doctor.name}</h2>
            <div style={styles.infoBox}>
              <p style={styles.text}><strong>Email:</strong> {doctor.email}</p>
              <p style={styles.text}><strong>Profession:</strong> {doctor.profession || 'Not specified'}</p>
            </div>
            <button style={styles.button} onClick={() => navigate('/bookings')}>
              Book for nurses
            </button>
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
  navTitle: {
    marginLeft: '8px',
  },
  navRight: {
    display: 'flex',
    alignItems: 'center',
    gap: '15px',
  },
  navEmail: {
    fontSize: '14px',
    opacity: 0.85,
  },
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
  contentWrapper: {
    flex: 1,
    display: 'flex',
    backgroundColor: '#f0f4f8',
  },
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
  activeNavItem: {
    backgroundColor: '#2d5d8c', // highlight active page
  },
  mainContent: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px',
  },
  card: {
    background: '#ffffff',
    padding: '40px 30px',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
    width: '420px',
    border: '1px solid #e0e6ed',
  },
  heading: {
    color: '#2d5d8c',
    fontSize: '24px',
    marginBottom: '20px',
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#f8fbff',
    border: '1px solid #d0e3f0',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  text: {
    fontSize: '16px',
    color: '#333',
    marginBottom: '8px',
  },
  button: {
    marginTop: '10px',
    padding: '12px 20px',
    fontSize: '16px',
    border: 'none',
    borderRadius: '8px',
    background: '#2d5d8c',
    color: 'white',
    cursor: 'pointer',
    transition: '0.3s',
  },
};

export default DoctorIntroPage;
