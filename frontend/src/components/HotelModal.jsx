import React, { useState, useEffect } from 'react';
import AddGuest from './AddGuest';
import RoomSelect from './RoomSelect';
import api from '../api';

export default function HotelModal({ hotel, onClose, user }) {
  const [step, setStep] = useState(0); // Always start with hotel details
  const [guestId, setGuestId] = useState(user ? user.id : null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState('');
  const [rooms, setRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Fetch rooms for this hotel
  useEffect(() => {
    if (hotel) {
      api.get(`rooms/?hotel=${hotel.id}`)
        .then(res => {
          setRooms(res.data.filter(r => r.is_available));
          setLoadingRooms(false);
        })
        .catch(() => setLoadingRooms(false));
    }
  }, [hotel]);

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
            padding: '34px 28px 24px 28px',
            minWidth: 480,
            maxWidth: 720,
            width: '95vw',
            maxHeight: '90vh',
            overflowY: 'auto',
            boxShadow: '0 8px 40px rgba(0,115,230,0.13), 0 2px 12px rgba(0,0,0,0.10)',
            borderRadius: 20,
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
          }}
        >
          <button className="modal-close" onClick={onClose} style={{top: 12, right: 16}}>&times;</button>
          
          {step === 0 && (
            <>
              {/* Hotel Details Section */}
              <div style={{
                marginBottom: '32px', 
                textAlign: 'center',
                background: 'linear-gradient(120deg, #f8fbff 0%, #f0f7ff 100%)',
                padding: '21px 20px',
                borderRadius: '16px',
                border: '1.5px solid #e0e7ff'
              }}>
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  marginBottom: '20px'
                }}>
                  <img
                    src={hotel.image ? hotel.image : process.env.PUBLIC_URL + `/hotel-${hotel.id}.jpg`}
                    alt={hotel.name}
                    className="hotel-img"
                    style={{ 
                      width: '480px',
                      height: '280px',
                      objectFit: 'cover', 
                      borderRadius: '12px', 
                      boxShadow: '0 4px 20px rgba(0,115,230,0.15)',
                      border: '2px solid #ffffff'
                    }}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = process.env.PUBLIC_URL + '/hotel-placeholder.jpg';
                    }}
                  />
                </div>
                
                <div style={{maxWidth: '400px', margin: '0 auto'}}>
                  <h2 style={{
                    marginTop: '0px',
                    marginBottom: '12px', 
                    fontSize: '1.8rem', 
                    fontWeight: 800, 
                    color: '#0073e6',
                    letterSpacing: '0.02em',
                    lineHeight: 1.2
                  }}>
                    {hotel.name}
                  </h2>
                  
                  <p style={{
                    color: '#444', 
                    marginBottom: '12px', 
                    fontSize: '1.1rem', 
                    lineHeight: 1.5,
                    fontWeight: 500
                  }}>
                    {hotel.description}
                  </p>
                  
                  <div style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    background: '#ffffff',
                    padding: '8px 16px',
                    borderRadius: '20px',
                    border: '1.5px solid #e0e7ff',
                    boxShadow: '0 2px 8px rgba(0,115,230,0.08)'
                  }}>
                    <svg 
                      width="16" 
                      height="16" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      xmlns="http://www.w3.org/2000/svg"
                      style={{marginRight: '8px', flexShrink: 0}}
                    >
                      <path 
                        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" 
                        fill="#d32f2f"
                      />
                    </svg>
                    <span style={{
                      color: '#666', 
                      fontSize: '0.98rem', 
                      fontWeight: 600,
                      fontStyle: 'normal'
                    }}>
                      {hotel.address}
                    </span>
                  </div>
                </div>
              </div>

              {/* Available Rooms Section */}
              <div style={{marginBottom: '20px'}}>
                <h3 style={{
                  fontSize: '1.25rem', 
                  fontWeight: 700, 
                  marginBottom: '16px', 
                  color: '#0073e6',
                  borderLeft: '4px solid #00c6fb',
                  paddingLeft: '12px'
                }}>
                  Available Rooms ({rooms.length})
                </h3>
                
                {loadingRooms ? (
                  <p style={{textAlign: 'center', color: '#666'}}>Loading rooms...</p>
                ) : rooms.length === 0 ? (
                  <p style={{textAlign: 'center', color: '#d32f2f', fontWeight: 600}}>No available rooms at this time.</p>
                ) : (
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
                    gap: '16px',
                    maxHeight: '300px',
                    overflowY: 'auto',
                    padding: '8px'
                  }}>
                    {rooms.map(room => (
                      <div 
                        key={room.id} 
                        style={{
                          border: selectedRoom?.id === room.id ? '2.5px solid #0073e6' : '1.5px solid #e0e7ff',
                          borderRadius: '12px',
                          padding: '20px 16px',
                          background: selectedRoom?.id === room.id 
                            ? 'linear-gradient(120deg, #e8f4ff 0%, #f0f7ff 100%)'
                            : 'linear-gradient(120deg, #f8fbff 0%, #f0f7ff 100%)',
                          boxShadow: selectedRoom?.id === room.id 
                            ? '0 4px 16px rgba(0,115,230,0.15)'
                            : '0 2px 8px rgba(0,115,230,0.06)',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          textAlign: 'center',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease'
                        }}
                        onClick={() => {
                          setSelectedRoom(room);
                          if (user) {
                            // Go directly to room selection step
                            setStep(2);
                          } else {
                            // Go to user registration step
                            setStep(1);
                          }
                        }}
                        onMouseEnter={(e) => {
                          if (selectedRoom?.id !== room.id) {
                            e.target.style.transform = 'translateY(-2px)';
                            e.target.style.boxShadow = '0 4px 12px rgba(0,115,230,0.12)';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (selectedRoom?.id !== room.id) {
                            e.target.style.transform = 'translateY(0px)';
                            e.target.style.boxShadow = '0 2px 8px rgba(0,115,230,0.06)';
                          }
                        }}
                      >
                        <img
                          src={room.image ? room.image : process.env.PUBLIC_URL + `/room-${room.id}.jpg`}
                          alt={room.room_type}
                          style={{
                            width: '100%',
                            height: '120px',
                            objectFit: 'cover',
                            borderRadius: '8px',
                            marginBottom: '12px',
                            border: '1px solid #e0e7ff'
                          }}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = process.env.PUBLIC_URL + '/room-placeholder.jpg';
                          }}
                        />
                        <h4 style={{margin: '0 0 6px 0', fontSize: '1.1rem', fontWeight: 700, color: '#0073e6'}}>
                          Room {room.room_number}
                        </h4>
                        <p style={{margin: '0 0 4px 0', fontSize: '0.95rem', color: '#666', fontWeight: 600}}>
                          {room.room_type}
                        </p>
                        <p style={{margin: '0', fontSize: '1.1rem', fontWeight: 700, color: '#009e60'}}>
                          ₹{room.price} / night
                        </p>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {selectedRoom && (
                <div style={{
                  background: '#f0f8ff',
                  border: '1.5px solid #c9e2ff',
                  borderRadius: '12px',
                  padding: '16px 20px',
                  marginTop: '20px',
                  textAlign: 'center'
                }}>
                  <p style={{margin: '0 0 8px 0', fontSize: '1rem', color: '#0073e6', fontWeight: 600}}>
                    Selected: Room {selectedRoom.room_number} - {selectedRoom.room_type}
                  </p>
                  <p style={{margin: '0', fontSize: '1.1rem', fontWeight: 700, color: '#009e60'}}>
                    ₹{selectedRoom.price} per night
                  </p>
                </div>
              )}
            </>
          )}
          
          {step === 1 && selectedRoom && (
            <div style={{
              width: '100%', 
              maxWidth: 420, 
              margin: '0 auto',
              background: '#f8fbff',
              padding: '24px 20px',
              borderRadius: '16px',
              border: '1.5px solid #e0e7ff'
            }}>
              <h3 style={{textAlign: 'center', marginBottom: '20px', color: '#0073e6'}}>
                Complete Your Booking
              </h3>
              <AddGuest
                hotelId={null}
                modalMode
                onUserAdded={handleUserAdded}
                setError={setError}
              />
            </div>
          )}
          
          {step === 2 && guestId && selectedRoom && (
            <div style={{
              width: '100%', 
              maxWidth: 480, 
              margin: '0 auto',
              background: '#f8fbff',
              padding: '24px 20px',
              borderRadius: '16px',
              border: '1.5px solid #e0e7ff'
            }}>
              <RoomSelect
                hotelId={hotel.id}
                guestId={guestId}
                onBook={handleBookingSuccess}
                onCancel={() => setStep(0)}
                preSelectedRoom={selectedRoom}
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
