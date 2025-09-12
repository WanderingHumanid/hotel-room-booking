import React, { useState } from 'react';
import api from '../api';

export default function ExistingUserLookup({ onUserFound, onClose }) {
  const [lookup, setLookup] = useState({ email: '', phone: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [foundUser, setFoundUser] = useState(null);

  const handleChange = e => {
    setLookup(prev => ({ ...prev, [e.target.name]: e.target.value }));
    setError('');
    setFoundUser(null);
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setFoundUser(null);
    
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
      // Use the password verification endpoint to find and verify user
      const verifyData = {
        password: lookup.password
      };
      
      if (lookup.email) {
        verifyData.email = lookup.email;
      } else if (lookup.phone) {
        verifyData.phone = lookup.phone;
      }
      
      const res = await api.post('auth/verify/', verifyData);
      setFoundUser(res.data.guest);
    } catch (err) {
      if (err.response?.status === 401) {
        setError('Invalid password.');
      } else if (err.response?.status === 404) {
        setError('No user found with this email/phone.');
      } else {
        setError('Error verifying user credentials.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" style={{zIndex: 2000}}>
      <div className="modal-content" style={{maxWidth: 400, width: '95vw', position: 'relative'}} onClick={e => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>&times;</button>
        <h2>Find Existing User</h2>
        <form className="modal-user-form" onSubmit={handleSubmit} style={{marginBottom: 10}}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={lookup.email}
            onChange={handleChange}
          />
          <div style={{textAlign: 'center', color: '#888', fontSize: '0.98rem', margin: '0 0 8px 0'}}>
            <span style={{fontWeight: 600}}>OR</span>
          </div>
          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={lookup.phone}
            onChange={handleChange}
          />
          <input
            type="password"
            name="password"
            placeholder="Your Password"
            value={lookup.password}
            onChange={handleChange}
            required
          />
          <button type="submit" style={{minWidth: 120, fontSize: '1.08rem', borderRadius: 8, fontWeight: 700, marginTop: 8, padding: '14px 0'}}>
            {loading ? 'Verifying...' : 'Find User'}
          </button>
        </form>
        {error && <div style={{color: '#d32f2f', textAlign: 'center', fontWeight: 600, marginBottom: 12}}>{error}</div>}
        {loading && <div style={{textAlign: 'center'}}>Loading...</div>}
        {foundUser && (
          <div style={{marginTop: 18, textAlign: 'center'}}>
            <div style={{fontWeight: 700, color: '#0073e6', fontSize: '1.13rem', marginBottom: 8}}>
              ✅ {foundUser.first_name} {foundUser.last_name} ({foundUser.phone})
            </div>
            <button
              className="modal-book-btn"
              style={{width: '100%', padding: '18px 0', borderRadius: 10, fontWeight: 800, fontSize: '1.13rem', marginTop: 8}}
              onClick={() => onUserFound(foundUser)}
            >
              Book for this user
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
