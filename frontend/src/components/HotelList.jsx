import React, { useEffect, useState } from 'react';
import api from '../api';

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('hotels/')
      .then(response => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading hotels...</p>;

  return (
    <div>
      <h2>Hotel List</h2>
      <ul>
        {hotels.map(hotel => (
          <li key={hotel.id}>
            <strong>{hotel.name}</strong><br />
            {hotel.address}<br />
            <em>{hotel.description}</em>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default HotelList;
