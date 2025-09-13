import React, { useState, useEffect } from 'react';
import HotelSection from './components/HotelSection';
// import RoomList from './components/RoomList';
// import AddGuest from './components/AddGuest';
import ViewBookings from './components/ViewBookings';
import AuthModal from './components/AuthModal';
import GradientText from './GradientText';
import AboutUs from './AboutUs';
import './HotelBooking.css';

function App() {
  // const [showBookings, setShowBookings] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [showBookingLookup, setShowBookingLookup] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [user, setUser] = useState(null);
  const [darkMode] = useState(() => {
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

  // Check for stored user session on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('luxestay_user') || sessionStorage.getItem('luxestay_user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user data:', error);
        localStorage.removeItem('luxestay_user');
        sessionStorage.removeItem('luxestay_user');
      }
    }
  }, []);

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem('luxestay_user');
    sessionStorage.removeItem('luxestay_user');
    setShowBookingLookup(false);
  };

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
            LuxeStay
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
          
          {user ? (
            <>
              <button
                className="toggle-btn"
                style={{minWidth: 120, fontSize: '1.01rem', padding: '8px 14px', borderRadius: 8, fontWeight: 600, background: showBookingLookup ? '#e0e7ff' : '#fff'}}
                onClick={() => setShowBookingLookup(b => !b)}
              >
                {showBookingLookup ? 'Hide My Bookings' : 'My Bookings'}
              </button>
              <button
                onClick={handleLogout}
                style={{
                  minWidth: 80, 
                  fontSize: '0.98rem', 
                  padding: '8px 14px', 
                  borderRadius: 8, 
                  fontWeight: 600,
                  background: '#fff4f4',
                  border: '1.5px solid #ffebee',
                  color: '#d32f2f',
                  cursor: 'pointer'
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuthModal(true)}
              style={{
                minWidth: 100, 
                fontSize: '1.01rem', 
                padding: '8px 16px', 
                borderRadius: 8, 
                fontWeight: 600,
                background: '#f0f8ff',
                border: '1.5px solid #e0e7ff',
                color: '#0073e6',
                cursor: 'pointer'
              }}
            >
              Sign In / Join
            </button>
          )}
        </nav>
      </header>

      {showAbout ? (
        <AboutUs />
      ) : showBookingLookup ? (
        <ViewBookings lookupMode user={user} />
      ) : (
        <>
          {/* ================= Hotel Cards - Primary Focus ================= */}
          <section>
            <h2 style={{textAlign: 'center', fontSize: '2.2rem', margin: '24px 0 32px 0'}}>
              Find Your Perfect Stay
            </h2>
            <p style={{
              textAlign: 'center', 
              fontSize: '1.15rem', 
              color: '#666', 
              marginBottom: '36px',
              maxWidth: '600px',
              margin: '0 auto 36px auto',
              lineHeight: 1.6
            }}>
              Discover exceptional hotels with comfortable rooms, premium amenities, and unbeatable prices. 
              Click on any hotel to explore available rooms and make your reservation.
            </p>
            
            <HotelSection user={user} />
          </section>
        </>
      )}

      {/* ================= Authentication Modal ================= */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  );
}

export default App;
