import React, { useEffect, useState } from 'react';
import api from '../api';

export default function RoomSelect({ hotelId, guestId, onBook, onCancel }) {
  const [rooms, setRooms] = useState([]);
  const [selectedRoom, setSelectedRoom] = useState('');
  const [status, setStatus] = useState('');
  const [loading, setLoading] = useState(true);

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
    try {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      const checkIn = today.toISOString().slice(0, 10);
      const checkOut = tomorrow.toISOString().slice(0, 10);
      await api.post('bookings/', {
        guest_id: guestId,
        room_id: selectedRoom,
        check_in: checkIn,
        check_out: checkOut,
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
    <form className="modal-user-form" onSubmit={handleBook} style={{margin: 0, padding: 0}}>
      <h2 style={{marginBottom: 0}}>Select a Room</h2>
      <select value={selectedRoom} onChange={e => setSelectedRoom(e.target.value)} required style={{padding: '14px', fontSize: '1.13rem', borderRadius: 8, border: '1.5px solid #e0e7ff'}}>
        <option value="">Choose a room...</option>
        {rooms.map(room => (
          <option key={room.id} value={room.id}>
            Room {room.room_number} - {room.room_type} - ₹{room.price}
          </option>
        ))}
      </select>
      <button type="submit" style={{marginTop: 8}}>Book Room</button>
      {status && status !== 'success' && <p style={{color: '#d32f2f', margin: 0}}>{status}</p>}
    </form>
  );
}
