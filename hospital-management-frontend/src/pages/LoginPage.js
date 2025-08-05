import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';


const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const response = await fetch('http://localhost:5078/api/doctor/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError('Invalid credentials');
        return;
      }

      const doctor = await response.json();

      localStorage.setItem('doctor', JSON.stringify(doctor));
      navigate('/intro'); // Redirect to DoctorIntroPage
    } catch (err) {
      console.error(err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <div style={{ fontFamily: 'Segoe UI, sans-serif' }}>
      {/* Navbar */}
      <nav style={styles.navbar}>
        <div style={styles.logo}>🏥 Hospital Management</div>
        <ul style={styles.navLinks}>
          <li><a href="/" style={styles.navLink}>Home</a></li>
          <li><a href="/about" style={styles.navLink}>About</a></li>
          <li><a href="/contact" style={styles.navLink}>Contact</a></li>
        </ul>
        <button style={styles.navButton}>Login</button>
      </nav>

      {/* Login Form */}
      <div style={styles.wrapper}>
        <div style={styles.card}>
          <h2 style={styles.heading}>Doctor Login</h2>
          <form onSubmit={handleLogin} style={styles.form}>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            <button type="submit" style={styles.button}>Login</button>
            {error && <p style={styles.error}>{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
};

const styles = {
  // Navbar Styles
  navbar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    background: '#1a2a3a', // subtle dark hospital navbar
    padding: '15px 40px',
    color: 'white',
    position: 'fixed',
    width: '100%',
    top: 0,
    left: 0,
    zIndex: 1000,
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 'bold',
  },
  navLinks: {
    listStyle: 'none',
    display: 'flex',
    gap: '25px',
    margin: 0,
    padding: 0,
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    fontSize: '15px',
    opacity: 0.85,
    transition: '0.3s',
  },
  navButton: {
    background: '#2d5d8c',
    color: 'white',
    border: 'none',
    padding: '8px 16px',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    fontWeight: 'bold',
    transition: '0.3s',
    marginRight: "50px",
  },

  // Login Page Styles
  wrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh',
    background: '#f0f4f8', // subtle hospital background
    paddingTop: '80px', // space for navbar
  },
  card: {
    width: '380px',
    padding: '35px 30px',
    backgroundColor: 'white',
    borderRadius: '12px',
    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
    textAlign: 'center',
    border: '1px solid #e0e6ed',
  },
  heading: {
    marginBottom: '20px',
    color: '#2d5d8c', // hospital blue
    fontSize: '24px',
    fontWeight: 600,
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '15px',
  },
  input: {
    padding: '12px',
    fontSize: '16px',
    border: '1px solid #ccd6e3',
    borderRadius: '8px',
    outline: 'none',
    transition: '0.3s',
    backgroundColor: '#f8fbff',
  },
  button: {
    padding: '12px',
    background: '#2d5d8c',
    color: 'white',
    fontSize: '16px',
    fontWeight: 600,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: '0.3s',
  },
  error: {
    color: '#f05454',
    marginTop: '10px',
    fontSize: '14px',
  },
};

export default LoginPage;
