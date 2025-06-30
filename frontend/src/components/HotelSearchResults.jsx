import React from 'react';

function HotelSearchResults({ hotels }) {
  if (!hotels || hotels.length === 0) {
    return <p style={{textAlign: 'center', marginTop: '2rem'}}>No hotels found for your search.</p>;
  }
  return (
    <div className="card-list" style={{marginTop: '2rem'}}>
      {hotels.map(hotel => {
        const imgSrc = process.env.PUBLIC_URL + `/hotel-${hotel.id}.jpg`;
        const handleImgError = (e) => {
          e.target.onerror = null;
          e.target.src = process.env.PUBLIC_URL + '/hotel-placeholder.jpg';
        };
        return (
          <div className="card" key={hotel.id} style={{alignItems: 'center'}}>
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
    </div>
  );
}

export default HotelSearchResults;
