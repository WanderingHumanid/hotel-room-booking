import React, { useState } from 'react';
import AddGuest from './AddGuest';
import RoomSelect from './RoomSelect';

export default function HotelModal({ hotel, onClose }) {
  const [step, setStep] = useState(0); // 0: info, 1: user, 2: room
  const [guestId, setGuestId] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');

  // Handler to show success popup and close modal
  const handleBookingSuccess = () => {
    setShowSuccess(true);
    setTimeout(() => {
      setShowSuccess(false);
      onClose();
    }, 1400);
  };

  // After user is added, move to room select
  const handleUserAdded = (id) => {
    setGuestId(id);
    setStep(2);
  };

  return (
    <>
      <div className="modal-overlay" onClick={onClose}>
        <div
          className="modal-content"
          onClick={e => e.stopPropagation()}
          style={{
            padding: '40px 32px 28px 32px',
            minWidth: 340,
            maxWidth: 440,
            width: '98vw',
            boxShadow: '0 8px 40px rgba(0,115,230,0.13), 0 2px 12px rgba(0,0,0,0.10)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 18,
            position: 'relative',
          }}
        >
          <button className="modal-close" onClick={onClose} style={{top: 12, right: 16}}>&times;</button>
          {step === 0 && (
            <>
              <img
                src={process.env.PUBLIC_URL + `/hotel-${hotel.id}.jpg`}
                alt={hotel.name}
                className="hotel-img"
                style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 14, marginBottom: 18, boxShadow: '0 2px 16px rgba(0,115,230,0.10)' }}
              />
              <h2 style={{marginBottom: 8, fontSize: '1.32rem', fontWeight: 800, textAlign: 'center'}}>{hotel.name}</h2>
              <p style={{color: '#555', marginBottom: 18, fontSize: '1.05rem', textAlign: 'center'}}>{hotel.description}</p>
              <button
                className="modal-book-btn"
                style={{width: '100%', fontWeight: 700, fontSize: '1.13rem', padding: '16px 0', borderRadius: 10, marginBottom: 6, marginTop: 6, letterSpacing: 0.01}}
                onClick={() => setStep(1)}
              >
                Do you want to book this hotel?
              </button>
            </>
          )}
          {step === 1 && (
            <div style={{width: '100%', maxWidth: 370, margin: '0 auto'}}>
              <AddGuest
                hotelId={null}
                modalMode
                onUserAdded={handleUserAdded}
                setError={setError}
              />
            </div>
          )}
          {step === 2 && guestId && (
            <div style={{width: '100%', maxWidth: 370, margin: '0 auto'}}>
              <RoomSelect
                hotelId={hotel.id}
                guestId={guestId}
                onBook={handleBookingSuccess}
                onCancel={() => setStep(0)}
              />
            </div>
          )}
          {error && <div style={{color:'#d32f2f', marginTop:8, textAlign:'center'}}>{error}</div>}
        </div>
      </div>
      {showSuccess && (
        <div className="success-popup">Room booked successfully!</div>
      )}
    </>
  );
}
