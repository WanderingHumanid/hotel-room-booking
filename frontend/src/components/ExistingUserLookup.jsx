import React, { useState } from 'react';
import api from '../api';

export default function ExistingUserLookup({ onUserFound, onClose }) {
  const [lookup, setLookup] = useState({ first_name: '', last_name: '', phone: '' });
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
      const res = await api.get('guests/', { params });
      if (res.data.length === 0) {
        setError('No user found.');
      } else if (res.data.length === 1) {
        setFoundUser(res.data[0]);
      } else if (lookup.phone) {
        // If phone is provided but multiple users found, that's a data error, but pick the first
        setFoundUser(res.data[0]);
      } else if (lookup.first_name && lookup.last_name) {
        // Try to match case-insensitive full name
        const match = res.data.find(u =>
          u.first_name.trim().toLowerCase() === lookup.first_name.trim().toLowerCase() &&
          u.last_name.trim().toLowerCase() === lookup.last_name.trim().toLowerCase()
        );
        if (match) {
          setFoundUser(match);
        } else {
          setError('No user found with that full name.');
        }
      } else {
        setError('Multiple users found. Please use phone number for unique lookup.');
      }
    } catch (err) {
      setError('Error fetching user.');
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
            type="text"
            name="first_name"
            placeholder="First Name"
            value={lookup.first_name}
            onChange={handleChange}
          />
          <input
            type="text"
            name="last_name"
            placeholder="Last Name"
            value={lookup.last_name}
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
          <button type="submit" style={{minWidth: 120, fontSize: '1.08rem', borderRadius: 8, fontWeight: 700, marginTop: 8, padding: '14px 0'}}>Find User</button>
        </form>
        {error && <div style={{color: '#d32f2f', textAlign: 'center', fontWeight: 600, marginBottom: 12}}>{error}</div>}
        {loading && <div style={{textAlign: 'center'}}>Loading...</div>}
        {foundUser && (
          <div style={{marginTop: 18, textAlign: 'center'}}>
            <div style={{fontWeight: 700, color: '#0073e6', fontSize: '1.13rem', marginBottom: 8}}>
              {foundUser.first_name} {foundUser.last_name} ({foundUser.phone})
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
