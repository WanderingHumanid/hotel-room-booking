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
    <>
      {rooms.map(room => {
        // Use /room-[id].jpg for each room, fallback to placeholder
        const imgSrc = process.env.PUBLIC_URL + `/room-${room.id}.jpg`;
        const handleImgError = (e) => {
          e.target.onerror = null;
          e.target.src = process.env.PUBLIC_URL + '/room-placeholder.jpg';
        };
        return (
          <div className="card" key={room.id} style={{alignItems: 'center'}}>
            <img
              className="room-img"
              src={imgSrc}
              alt={room.room_type}
              onError={handleImgError}
            />
            <h3 style={{margin: 0}}>
              {room.hotel?.name || 'Unknown Hotel'} - Room {room.room_number}
            </h3>
            <p style={{margin: '8px 0 0 0', color: '#555', fontSize: '0.98rem', textAlign: 'center'}}>
              {room.room_type} &nbsp;|&nbsp; ₹{room.price} &nbsp;|&nbsp; {room.is_available ? 'Available' : 'Booked'}
            </p>
          </div>
        );
      })}
    </>
  );
}

export default RoomList;
