import React, { useEffect, useState } from 'react';
import api from '../api';
import HotelModal from './HotelModal';

function HotelList() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);

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
    <>
      {hotels.map(hotel => {
        const imgSrc = process.env.PUBLIC_URL + `/hotel-${hotel.id}.jpg`;
        const handleImgError = (e) => {
          e.target.onerror = null;
          e.target.src = process.env.PUBLIC_URL + '/hotel-placeholder.jpg';
        };
        return (
          <div
            className="card"
            key={hotel.id}
            style={{alignItems: 'center', cursor: 'pointer', transition: 'box-shadow 0.2s'}}
            onClick={() => setSelectedHotel(hotel)}
            tabIndex={0}
            onKeyDown={e => { if (e.key === 'Enter') setSelectedHotel(hotel); }}
          >
            <img
              className="hotel-img"
              src={imgSrc}
              alt={hotel.name}
              onError={handleImgError}
            />
            <h3 style={{margin: 0}}>{hotel.name}</h3>
            <p style={{margin: '8px 0 0 0', color: '#555', fontSize: '0.98rem', textAlign: 'center'}}>{hotel.description}</p>
          </div>
        );
      })}
      {selectedHotel && (
        <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} />
      )}
    </>
  );
}

export default HotelList;
