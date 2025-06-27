import React, { useEffect, useState } from 'react';
import api from '../api';

function ViewBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const handleCancel = (id) => {
  api.patch(`bookings/${id}/`, { status: 'cancelled' })
    .then(() => {
      setBookings(prev =>
        prev.map(b => (b.id === id ? { ...b, status: 'cancelled' } : b))
      );
    })
    .catch(err => {
      console.error('Error cancelling booking:', err);
    });
};


  useEffect(() => {
    api.get('bookings/')
      .then(res => {
        setBookings(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching bookings:', err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading bookings...</p>;

  return (
    <div>
      <h2>All Bookings</h2>
      <ul>
        {bookings.map(b => (
          <li key={b.id}>
            Guest: {b.guest?.first_name} {b.guest?.last_name} <br />
            Room: {b.room?.hotel?.name} - {b.room?.room_number} <br />
            Check-in: {b.check_in} | Check-out: {b.check_out} <br />
            Status: {b.status}
            {b.status !== 'cancelled' && (
              <button onClick={() => handleCancel(b.id)}>Cancel</button>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ViewBookings;
