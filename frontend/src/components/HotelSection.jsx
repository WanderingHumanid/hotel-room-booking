import React, { useEffect, useState } from 'react';
import api from '../api';
import HotelModal from './HotelModal';
import HotelSearch from './HotelSearch';

function HotelSection({ user }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedHotel, setSelectedHotel] = useState(null);
  const [searchResults, setSearchResults] = useState(null);
  const [isSearchMode, setIsSearchMode] = useState(false);

  useEffect(() => {
    loadAllHotels();
  }, []);

  const loadAllHotels = () => {
    setLoading(true);
    api.get('hotels/')
      .then(response => {
        setHotels(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching hotels:', error);
        setLoading(false);
      });
  };

  const handleSearchResults = (results) => {
    setSearchResults(results);
    setIsSearchMode(true);
  };

  const handleClearSearch = () => {
    setSearchResults(null);
    setIsSearchMode(false);
  };

  const displayedHotels = isSearchMode ? searchResults : hotels;

  if (loading) return <p>Loading hotels...</p>;

  return (
    <div className="hotel-section-container">
      {/* Main Hotels Content */}
      <div className="hotels-content">
        {/* Search Info */}
        {isSearchMode && (
          <div className="search-info">
            <p>Found {searchResults?.length || 0} hotel(s) matching your search criteria</p>
          </div>
        )}
        
        {/* Hotels Grid */}
        <div className="card-list">
          {displayedHotels && displayedHotels.length === 0 ? (
            <div className="no-results" style={{ gridColumn: '1 / -1' }}>
              <p>No hotels found matching your criteria.</p>
            </div>
          ) : (
            displayedHotels?.map(hotel => {
              const imgSrc = hotel.image_url || hotel.image || process.env.PUBLIC_URL + `/hotel-${((hotel.id - 1) % 6) + 1}.jpg`;
              
              const handleImgError = (e) => {
                e.target.onerror = null;
                
                // Extract the filename from the failed URL
                const urlParts = e.target.src.split('/');
                const filename = urlParts[urlParts.length - 1];
                
                // Try using the same filename from React public folder
                if (e.target.src.includes('127.0.0.1:8000') && filename.includes('hotel-')) {
                  const publicUrl = process.env.PUBLIC_URL + '/' + filename;
                  e.target.src = publicUrl;
                  return;
                }
                
                // If the original image_url failed, try the regular image field
                if (e.target.src === hotel.image_url && hotel.image && hotel.image !== hotel.image_url) {
                  e.target.src = hotel.image;
                  return;
                }
                
                // Try different fallback images based on hotel ID
                const fallbackImages = ['hotel-1.jpg', 'hotel-2.jpg', 'hotel-3.jpg', 'hotel-4.jpg', 'hotel-5.jpg', 'hotel-6.jpg'];
                const currentSrc = e.target.src;
                const currentIndex = fallbackImages.findIndex(img => currentSrc.includes(img));
                
                if (currentIndex < fallbackImages.length - 1) {
                  const nextImage = process.env.PUBLIC_URL + '/' + fallbackImages[currentIndex + 1];
                  e.target.src = nextImage;
                } else {
                  // Last resort: use room placeholder if available
                  e.target.src = process.env.PUBLIC_URL + '/room-placeholder.jpg';
                }
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
                <p style={{margin: '8px 0 4px 0', color: '#555', fontSize: '0.98rem', textAlign: 'center'}}>{hotel.description}</p>
                <div style={{
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  width: '100%', 
                  marginTop: '12px',
                  padding: '8px 12px',
                  background: 'linear-gradient(90deg, #f0f7ff 60%, #e0e7ff 100%)',
                  borderRadius: '8px',
                  border: '1px solid #e0e7ff'
                }}>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-start'}}>
                    <span style={{fontSize: '0.95rem', color: '#666', fontWeight: 600}}>Available Rooms:</span>
                    <span style={{fontSize: '0.95rem', color: '#666', fontWeight: 600}}>Starting from:</span>
                  </div>
                  <div style={{display: 'flex', flexDirection: 'column', alignItems: 'flex-end'}}>
                    <span style={{
                      fontSize: '1.1rem', 
                      fontWeight: 700, 
                      color: hotel.available_rooms_count > 0 ? '#009e60' : '#d32f2f',
                      padding: '2px 6px',
                      borderRadius: '4px',
                      background: hotel.available_rooms_count > 0 ? '#e8f5e8' : '#ffeaea'
                    }}>
                      {hotel.available_rooms_count || 0}
                    </span>
                    <span style={{
                      fontSize: '1.2rem', 
                      fontWeight: 800, 
                      color: '#0073e6',
                      marginTop: '2px'
                    }}>
                      {hotel.lowest_price ? `₹${hotel.lowest_price}` : 'N/A'}
                    </span>
                  </div>
                </div>
              </div>
            );
          })
        )}
        </div>
        
        {/* Hotel Modal */}
        {selectedHotel && (
          <HotelModal hotel={selectedHotel} onClose={() => setSelectedHotel(null)} user={user} />
        )}
      </div>
      
      {/* Search Sidebar */}
      <HotelSearch 
        onSearchResults={handleSearchResults}
        onClearSearch={handleClearSearch}
      />
    </div>
  );
}

export default HotelSection;