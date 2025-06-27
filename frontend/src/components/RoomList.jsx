import React, { useEffect, useState } from 'react';
import api from '../api';

function RoomList() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('rooms/')
      .then(response => {
        setRooms(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching rooms:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div>
      <h2>Room List</h2>
      <ul>
        {rooms.map(room => (
          <li key={room.id}>
            <strong>{room.hotel?.name || 'Unknown Hotel'}</strong><br />
            Room {room.room_number} - {room.room_type}<br />
            ₹{room.price} — {room.is_available ? 'Available' : 'Booked'}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default RoomList;
