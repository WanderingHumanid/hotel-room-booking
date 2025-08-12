import React, { useState, useEffect } from 'react';
import HotelList from './components/HotelList';
import RoomList from './components/RoomList';
// import AddGuest from './components/AddGuest';
import ViewBookings from './components/ViewBookings';
import GradientText from './GradientText';
import AboutUs from './AboutUs';
import './HotelBooking.css';

function App() {
  const [showBookings, setShowBookings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBookingLookup, setShowBookingLookup] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  return (
    <div className="App container">
      {/* ================= Header / Hero ================= */}
      <header>
        <GradientText
          colors={["#d1eadfff", "#4079ff", "#c6e5eaff", "#4079ff", "#98dbd5ff"]}
          animationSpeed={3}
          showBorder={false}
          className="custom-class"
        >
          <span
            style={{
              fontSize: '3rem',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              fontFamily: 'Segoe UI, Inter, Arial, sans-serif',
              lineHeight: 1.1
            }}
          >
            Hotel Booking
          </span>
        </GradientText>
        <nav>
          <button
            className="aboutus-btn"
            style={{minWidth: 80, fontSize: '0.98rem', padding: '4px 10px', borderRadius: 7, fontWeight: 600, background: showAbout ? '#e0e7ff' : '#f5faff'}}
            onClick={() => setShowAbout(a => !a)}
          >
            {showAbout ? 'Back to Home' : 'About Us'}
          </button>
          <button
            className="toggle-btn"
            style={{minWidth: 120, fontSize: '1.01rem', padding: '8px 14px', borderRadius: 8, fontWeight: 600, background: showBookingLookup ? '#e0e7ff' : '#fff'}}
            onClick={() => setShowBookingLookup(b => !b)}
          >
            {showBookingLookup ? 'Hide My Bookings' : 'Show Your Booking'}
          </button>
        </nav>
      </header>

      {showAbout ? (
        <AboutUs />
      ) : showBookingLookup ? (
        <ViewBookings lookupMode />
      ) : (
        <>
          {/* ================= Hotel & Room Cards ================= */}
          <section>
            <h2>Hotels</h2>
            <div className="card-list">
              <HotelList />
            </div>
            <h2 style={{marginTop: '40px'}}>Rooms</h2>
            <div className="card-list">
              <RoomList />
            </div>
          </section>
        </>
      )}
    </div>
  );
}

export default App;
