import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RoomSelect({ hotelId, guestId, onBook, onCancel, preSelectedRoom }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState(preSelectedRoom ? preSelectedRoom.id.toString() : '');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);
  const [guestCount, setGuestCount] = useState(1);
  const [checkIn, setCheckIn] = useState(() => {
    const today = new Date();
    return today.toISOString().slice(0, 10);
  });
  const [checkOut, setCheckOut] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().slice(0, 10);
  });

  useEffect(() => {
    api.get(`rooms/?hotel=${hotelId}`)
      .then(res => {
        setRooms(res.data.filter(r => r.is_available));
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [hotelId]);

  const handleBook = async (e) => {
    e.preventDefault();
    setStatus('');
    if (!selectedRoom) {
      setStatus('Please select a room.');
      return;
    }
    if (!checkIn || !checkOut) {
      setStatus('Please select check-in and check-out dates.');
      return;
    }
    if (checkOut <= checkIn) {
      setStatus('Check-out must be after check-in.');
      return;
    }
    try {
      await api.post('bookings/', {
        guest_id: guestId,
        room_id: selectedRoom,
        check_in: checkIn,
        check_out: checkOut,
        guest_count: guestCount,
        status: 'confirmed',
      });
      setStatus('success');
      if (onBook) onBook();
    } catch (err) {
      let msg = 'Booking failed.';
      if (err.response && err.response.data) {
        if (err.response.data.error) msg = err.response.data.error;
        else if (typeof err.response.data === 'string') msg = err.response.data;
        else if (typeof err.response.data === 'object') msg = Object.values(err.response.data).join(' ');
      }
      setStatus(msg);
    }
  };

  if (loading) return <div>Loading rooms...</div>;
  if (rooms.length === 0) return <div>No available rooms in this hotel.</div>;

  return (
    <form className="modal-user-form" onSubmit={handleBook} style={{margin: 'auto', padding: '24px 20px'}}>
      <h2 style={{
        marginBottom: '20px', 
        textAlign: 'center',
        fontSize: '1.6rem',
        color: '#0073e6',
        fontWeight: 700
      }}>
        Select a Room
      </h2>
      
      <div style={{marginBottom: '20px'}}>
        <label style={{
          display: 'block',
          fontWeight: 600, 
          color: '#0073e6', 
          fontSize: '1.05rem',
          marginBottom: '8px'
        }}>
          Choose Room
        </label>
        <select 
          value={selectedRoom} 
          onChange={e => setSelectedRoom(e.target.value)} 
          required 
          style={{
            width: '100%',
            padding: '16px 14px', 
            fontSize: '1.1rem', 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ff',
            background: '#ffffff',
            color: '#333'
          }}
        >
          <option value="">Choose a room...</option>
          {rooms.map(room => (
            <option key={room.id} value={room.id}>
              {room.room_number} - {room.room_type} - ₹{room.price}
            </option>
          ))}
        </select>
      </div>

      <div style={{marginBottom: '20px'}}>
        <label style={{
          display: 'block',
          fontWeight: 600, 
          color: '#0073e6', 
          fontSize: '1.05rem',
          marginBottom: '8px'
        }}>
          Number of Guests
        </label>
        <select 
          value={guestCount} 
          onChange={e => setGuestCount(parseInt(e.target.value))} 
          required 
          style={{
            width: '100%',
            padding: '16px 14px', 
            fontSize: '1.1rem', 
            borderRadius: 12, 
            border: '1.5px solid #e0e7ff',
            background: '#ffffff',
            color: '#333'
          }}
        >
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>
              {num} Guest{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>
      </div>

      <div style={{
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px', 
        width: '100%'
      }}>
        <div style={{flex: 1}}>
          <label style={{
            display: 'block',
            fontWeight: 600, 
            color: '#0073e6', 
            fontSize: '1.05rem',
            marginBottom: '8px'
          }}>
            Check-in
          </label>
          <input
            type="date"
            value={checkIn}
            min={new Date().toISOString().slice(0, 10)}
            onChange={e => setCheckIn(e.target.value)}
            required
            style={{
              width: '100%', 
              padding: '14px 12px', 
              borderRadius: 12, 
              border: '1.5px solid #e0e7ff', 
              fontSize: '1.05rem',
              background: '#ffffff',
              color: '#333'
            }}
          />
        </div>
        <div style={{flex: 1}}>
          <label style={{
            display: 'block',
            fontWeight: 600, 
            color: '#0073e6', 
            fontSize: '1.05rem',
            marginBottom: '8px'
          }}>
            Check-out
          </label>
          <input
            type="date"
            value={checkOut}
            min={checkIn}
            onChange={e => setCheckOut(e.target.value)}
            required
            style={{
              width: '100%', 
              padding: '14px 12px', 
              borderRadius: 12, 
              border: '1.5px solid #e0e7ff', 
              fontSize: '1.05rem',
              background: '#ffffff',
              color: '#333'
            }}
          />
        </div>
      </div>
      
      <button 
        type="submit" 
        style={{
          width: '100%',
          padding: '16px 20px',
          fontSize: '1.15rem',
          fontWeight: 700,
          borderRadius: 12,
          marginTop: '8px'
        }}
      >
        Book Room
      </button>
      
      {status && status !== 'success' && (
        <p style={{
          color: '#d32f2f', 
          margin: '16px 0 0 0',
          textAlign: 'center',
          fontWeight: 600,
          fontSize: '0.95rem'
        }}>
          {status}
        </p>
      )}
    </form>
  );
}
