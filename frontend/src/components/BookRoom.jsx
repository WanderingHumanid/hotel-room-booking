import React, { useEffect, useState } from 'react';
import api from '../api';

function BookRoom() {
  const [guests, setGuests] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [formData, setFormData] = useState({
    guest_id: '',
    room_id: '',
    check_in: '',
    check_out: '',
    guest_count: 1,
    status: 'confirmed'
  });

  const [statusMsg, setStatusMsg] = useState('');

  useEffect(() => {
    api.get('guests/').then(res => setGuests(res.data));
    api.get('rooms/').then(res => setRooms(res.data));
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  api.post('bookings/', formData)
    .then(() => {
      setStatusMsg('Booking created successfully!');
      setFormData({ guest_id: '', room_id: '', check_in: '', check_out: '', guest_count: 1, status: 'confirmed' });
    })
    .catch((err) => {
      const msg = err.response?.data?.error || 'Error creating booking.';
      setStatusMsg(msg);
    });
};


  return (
    <div>
      <h2>Book a Room</h2>
      <form onSubmit={handleSubmit}>
        <select name="guest_id" value={formData.guest} onChange={handleChange} required>
          <option value="">Select Guest</option>
          {guests.map(g => (
            <option key={g.id} value={g.id}>
              {g.first_name} {g.last_name}
            </option>
          ))}
        </select>

        <select name="room_id" value={formData.room} onChange={handleChange} required>
          <option value="">Select Room</option>
          {rooms.map(r => (
            <option key={r.id} value={r.id}>
              {r.hotel?.name} - Room {r.room_number}
            </option>
          ))}
        </select>

        <input type="date" name="check_in" value={formData.check_in} onChange={handleChange} required />
        <input type="date" name="check_out" value={formData.check_out} onChange={handleChange} required />

        <select name="guest_count" value={formData.guest_count} onChange={handleChange} required>
          <option value="">Number of Guests</option>
          {[1, 2, 3, 4, 5, 6].map(num => (
            <option key={num} value={num}>
              {num} Guest{num > 1 ? 's' : ''}
            </option>
          ))}
        </select>

        <button type="submit">Book Room</button>
      </form>

      {statusMsg && <p>{statusMsg}</p>}
    </div>
  );
}

export default BookRoom;
