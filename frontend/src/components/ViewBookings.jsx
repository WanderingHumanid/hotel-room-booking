import React, { useEffect, useState } from 'react';
import api from '../api';

function ViewBookings({ lookupMode }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [lookup, setLookup] = useState({ first_name: '', last_name: '', phone: '' });
  const [error, setError] = useState('');
  const [searched, setSearched] = useState(false);

  const handleCancel = (id) => {
    setCancelling(id);
    api.patch(`bookings/${id}/`, { status: 'cancelled' })
      .then(() => {
        setBookings(prev =>
          prev.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b))
        );
      })
      .catch(err => {
        console.error('Error cancelling booking:', err);
      })
      .finally(() => setCancelling(null));
  };

  const handleLookupChange = (e) => {
    setLookup(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setSearched(true);
    setLoading(true);
    setBookings([]);
    // Search by phone or by first+last name
    let params = {};
    if (lookup.phone) {
      params.phone = lookup.phone;
    } else if (lookup.first_name && lookup.last_name) {
      params.first_name = lookup.first_name;
      params.last_name = lookup.last_name;
    } else {
      setError('Enter phone OR both first and last name.');
      setLoading(false);
      return;
    }
    try {
      const res = await api.get('bookings/', { params });
      setBookings(res.data);
      if (res.data.length === 0) setError('No bookings found for this user.');
    } catch (err) {
      setError('Error fetching bookings.');
    }
    setLoading(false);
  };

  if (lookupMode) {
    return (
      <div style={{maxWidth: 420, margin: '0 auto', marginTop: 32}}>
        <h2>Show Your Booking</h2>
        <form className="modal-user-form" style={{marginBottom: 18}} onSubmit={handleLookup}>
          <input
            type="text"
            name="first_name"
            placeholder="First Name"
            value={lookup.first_name}
            onChange={handleLookupChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={lookup.last_name}
            onChange={handleLookupChange}
          />
          <div style={{textAlign: 'center', color: '#888', fontSize: '0.98rem', margin: '0 0 8px 0'}}>
            <span style={{fontWeight: 600}}>OR</span>
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={lookup.phone}
            onChange={handleLookupChange}
          />
          <button type="submit" style={{minWidth: 120, fontSize: '1.08rem', borderRadius: 8, fontWeight: 700}}>Show My Bookings</button>
        </form>
        {error && <div style={{color: '#d32f2f', textAlign: 'center', fontWeight: 600, marginBottom: 12}}>{error}</div>}
        {loading && <div style={{textAlign: 'center'}}>Loading...</div>}
        {bookings.length > 0 && (
          <div className="card-list" style={{marginTop: 24}}>
            {bookings.map(b => (
              <div className="card" key={b.id} style={{minWidth: 320, maxWidth: 420, alignItems: 'flex-start', position: 'relative', opacity: b.status === 'cancelled' ? 0.7 : 1}}>
                <div style={{marginBottom: 10}}>
                  <span style={{fontWeight: 700, color: '#0073e6'}}>Guest:</span> {b.guest?.first_name} {b.guest?.last_name}<br />
                  <span style={{fontWeight: 700, color: '#0073e6'}}>Room:</span> {b.room?.hotel?.name} - {b.room?.room_number}<br />
                  <span style={{fontWeight: 700, color: '#0073e6'}}>Check-in:</span> {b.check_in}<br />
                  <span style={{fontWeight: 700, color: '#0073e6'}}>Check-out:</span> {b.check_out}<br />
                  <span style={{fontWeight: 700, color: '#0073e6'}}>Status:</span> <span style={{color: b.status === 'cancelled' ? '#d32f2f' : '#009e60', fontWeight: 700, textTransform: 'capitalize'}}>{b.status}</span>
                </div>
                {b.status === 'cancelled' && (
                  <div style={{position: 'absolute', top: 12, right: 18, color: '#d32f2f', fontWeight: 700, fontSize: '1.05rem'}}>Cancelled</div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  }
  // Default: admin/all bookings view
  // ...existing code...
}

export default ViewBookings;
