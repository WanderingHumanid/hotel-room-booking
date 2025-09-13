import React, { useEffect, useState } from 'react';
import api from '../api';

function ViewBookings({ lookupMode, user }) {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(null);
  const [lookup, setLookup] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [verified, setVerified] = useState(false);

  // If user is logged in, automatically fetch their bookings
  useEffect(() => {
    if (user && lookupMode) {
      setVerified(true);
      setLoading(true);
      api.get(`bookings/?guest_email=${user.email}`)
        .then(response => {
          setBookings(response.data);
        })
        .catch(err => {
          console.error('Error fetching user bookings:', err);
          setError('Unable to fetch your bookings');
        })
        .finally(() => setLoading(false));
    }
  }, [user, lookupMode]);

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
    setVerified(false);
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setBookings([]);
    setVerified(false);
    
    // Validate inputs
    if (!lookup.password) {
      setError('Password is required.');
      setLoading(false);
      return;
    }
    
    if (!lookup.email && !lookup.phone) {
      setError('Enter email OR phone number.');
      setLoading(false);
      return;
    }
    
    try {
      // Use the new password verification endpoint
      const verifyData = {
        password: lookup.password
      };
      
      if (lookup.email) {
        verifyData.email = lookup.email;
      } else if (lookup.phone) {
        verifyData.phone = lookup.phone;
      }
      
      const res = await api.post('auth/verify/', verifyData);
      setBookings(res.data.bookings);
      setVerified(true);
      if (res.data.bookings.length === 0) setError('No bookings found for this user.');
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid password.');
      } else if (err.response?.status === 404) {
        setError('No user found with this email/phone.');
      } else {
        setError('Error verifying credentials or fetching bookings.');
      }
    }
    setLoading(false);
  };

  if (lookupMode) {
    return (
      <div style={{maxWidth: 520, margin: '0 auto', marginTop: 32}}>
        {user ? (
          <>
            <h2 style={{textAlign: 'center', color: '#0073e6', marginBottom: '24px'}}>
              Your Bookings
            </h2>
            <div style={{
              background: '#f0f8ff',
              padding: '16px 20px',
              borderRadius: '12px',
              border: '1.5px solid #c9e2ff',
              marginBottom: '24px',
              textAlign: 'center'
            }}>
              <p style={{margin: '0', fontSize: '1.05rem', color: '#0073e6', fontWeight: 600}}>
                Welcome back, {user.first_name}! Here are your bookings:
              </p>
            </div>
          </>
        ) : (
          <>
            <h2>Show Your Booking</h2>
            <form className="modal-user-form" style={{marginBottom: 18}} onSubmit={handleLookup}>
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={lookup.email}
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
              <input
                type="password"
                name="password"
                placeholder="Your Password"
                value={lookup.password}
                onChange={handleLookupChange}
                required
              />
              <button type="submit" style={{minWidth: 120, fontSize: '1.08rem', borderRadius: 8, fontWeight: 700}}>
            {loading ? 'Verifying...' : 'Show My Bookings'}
          </button>
        </form>
        </>
        )}
        
        {error && <div style={{color: '#d32f2f', textAlign: 'center', fontWeight: 600, marginBottom: 12}}>{error}</div>}
        {loading && <div style={{textAlign: 'center'}}>Loading...</div>}
        {verified && bookings.length > 0 && (
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
                {b.status !== 'cancelled' && (
                  <button
                    className="cancel-btn"
                    style={{marginTop: 8, width: '100%', fontWeight: 700, fontSize: '1.08rem', borderRadius: 8, padding: '12px 0'}}
                    disabled={cancelling === b.id}
                    onClick={() => handleCancel(b.id)}
                  >
                    {cancelling === b.id ? 'Cancelling...' : 'Cancel Booking'}
                  </button>
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
