import React, { useState } from 'react';
import api from '../api';


function AddGuest({ hotelId, modalMode, onBookingSuccess, onUserAdded, setError }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });
  const [status, setStatus] = useState('');
  const [booking, setBooking] = useState(null);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('');
    setBooking(null);
    if (setError) setError('');
    try {
      // 1. Add guest
      const guestRes = await api.post('guests/', formData);
      const guestId = guestRes.data.id;
      setStatus('User added successfully!');
      setFormData({ first_name: '', last_name: '', email: '', phone: '' });
      if (onUserAdded) onUserAdded(guestId);
    } catch (err) {
      let msg = 'Error adding user.';
      if (err.response && err.response.data) {
        if (err.response.data.email && Array.isArray(err.response.data.email)) {
          msg = err.response.data.email[0];
        } else if (typeof err.response.data === 'string') {
          msg = err.response.data;
        }
      }
      setStatus(msg);
      if (setError) setError(msg);
    }
  };

  return (
    <div>
      <h2>{'Add User Details'}</h2>
      <form
        onSubmit={handleSubmit}
        className={modalMode ? 'modal-user-form' : 'hero-search add-user-form'}
        style={modalMode ? {
          maxWidth: 420,
          margin: '0 auto',
          display: 'flex',
          flexDirection: 'column',
          gap: 16,
          background: 'rgba(255,255,255,0.98)',
          border: '1.5px solid #e0e7ff',
          boxShadow: '0 2px 24px rgba(0,115,230,0.10)',
          borderRadius: 12,
          padding: 0,
        } : {
          maxWidth: 900,
          margin: '0 auto 32px auto',
          flexWrap: 'nowrap',
          gap: 28,
          justifyContent: 'center',
          alignItems: 'flex-end',
          background: 'rgba(255,255,255,0.98)',
          border: '1.5px solid #e0e7ff',
          boxShadow: '0 2px 24px rgba(0,115,230,0.10)',
        }}
      >
        <input
          type="text"
          name="first_name"
          placeholder="First Name"
          value={formData.first_name}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="last_name"
          placeholder="Last Name"
          value={formData.last_name}
          onChange={handleChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleChange}
          required
        />
        <input
          type="text"
          name="phone"
          placeholder="Phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
        <button
          type="submit"
          style={{
            minWidth: 180,
            marginTop: 0,
            fontSize: '1.13rem',
            padding: '18px 0',
            borderRadius: 10,
            fontWeight: 700,
          }}
        >
          Confirm User
        </button>
      </form>
      {status && (
        <p style={{textAlign: 'center', marginTop: 12, color: status.includes('success') ? '#0073e6' : '#d32f2f', fontWeight: 600, fontSize: '1.08rem'}}>{status}</p>
      )}
      {booking && (
        <div style={{textAlign: 'center', marginTop: 16, color: '#009e60', fontWeight: 600}}>
          Booking Confirmed!<br />
          Room: {booking.room} | Check-in: {booking.check_in} | Check-out: {booking.check_out}
        </div>
      )}
    </div>
  );
}

export default AddGuest;
