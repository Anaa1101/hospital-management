import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import DoctorIntroPage from './pages/DoctorIntroPage';
import BookingPage from './pages/BookingPage'
import BookingHistoryPage from './pages/BookingHistoryPage'
// Other imports will come later

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/intro" element={<DoctorIntroPage />}/>
        {/* Intro and other routes to be added later */}
        <Route path="/bookings" element={<BookingPage/>}/>
        <Route path="/history" element={<BookingHistoryPage/>}/>
      </Routes>
    </Router>
  );
}

export default App;
