import React, { useState } from 'react';
import HotelList from './components/HotelList';
import RoomList from './components/RoomList';
import AddGuest from './components/AddGuest';
import BookRoom from './components/BookRoom';
import ViewBookings from './components/ViewBookings'; // if you want bookings later
import './HotelBooking.css';
import logo from './logo.png'; // adjust path if in assets: './assets/logo.png'


function App() {
  // collapse states
  const [showGuestForms, setShowGuestForms] = useState(false);
  const [showBookings, setShowBookings] = useState(false); // rename if you want to show “rooms” instead

  return (
    <div className="App container">
      <header>
        <img src={logo} alt="Hotel Logo" />
        <h1>A10 ROOMZ</h1>
      </header>

      {/* 1. Hotel List & Room List side by side */}
      <div className="flex-row">
        <div className="flex-col">
          <HotelList />
        </div>
        <div className="flex-col">
          <RoomList />
        </div>
      </div>

      {/* 2. Add Guest & Book Room collapsible */}
      <section>
        <button
          className="toggle-btn"
          onClick={() => setShowGuestForms(prev => !prev)}
        >
          {showGuestForms ? 'Hide Guest & Booking Forms' : 'Show Guest & Booking Forms'}
        </button>
        {showGuestForms && (
          <>
            <AddGuest />    {/* Add Guest form */}
            <BookRoom />    {/* Book Room form */}
          </>
        )}
      </section>

      {/* 3. Show Bookings (or change label to “Show Rooms” if you prefer) */}
      <section>
        <button
          className="toggle-btn"
          onClick={() => setShowBookings(prev => !prev)}
        >
          {showBookings ? 'Hide Bookings' : 'Show All Bookings'}
        </button>
        {showBookings && <ViewBookings />}
      </section>
    </div>
  );
}

export default App;
