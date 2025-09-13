import React, { useState, useEffect } from 'react';

function TestImageComponent() {
  const [apiData, setApiData] = useState(null);
  const testImageUrl = "http://127.0.0.1:8000/media/hotels/hotel-5.jpg";
  
  useEffect(() => {
    // Fetch actual API data to test with real URLs
    fetch('http://127.0.0.1:8000/api/hotels/')
      .then(response => response.json())
      .then(data => {
        console.log('API Data received:', data);
        setApiData(data);
      })
      .catch(error => console.error('API Error:', error));
  }, []);

  const handleLoad = () => {
    console.log("✅ Image loaded successfully:", testImageUrl);
  };
  
  const handleError = (e) => {
    console.log("❌ Image failed to load:", testImageUrl);
    console.log("Error details:", e);
  };
  
  return (
    <div style={{ padding: '20px', border: '2px solid #ccc', margin: '20px' }}>
      <h3>Image Test</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        
        {/* Direct Django media URL */}
        <div>
          <h4>Django Media (hotel-5.jpg)</h4>
          <p style={{fontSize: '12px'}}>{testImageUrl}</p>
          <img 
            src={testImageUrl}
            alt="Test hotel"
            onLoad={handleLoad}
            onError={handleError}
            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
          />
        </div>
        
        {/* Public folder image */}
        <div>
          <h4>Public Folder (hotel-1.jpg)</h4>
          <img 
            src={process.env.PUBLIC_URL + '/hotel-1.jpg'} 
            alt="Public hotel 1"
            style={{ width: '200px', height: '150px', objectFit: 'cover' }}
            onLoad={() => console.log('✅ Public hotel-1.jpg loaded')}
            onError={(e) => {
              console.log('❌ Public hotel-1.jpg failed:', e);
              e.target.style.border = '2px solid red';
            }}
          />
        </div>
        
        {/* Test with API URLs */}
        {apiData && apiData.length > 0 && (
          <div>
            <h4>API Image URL ({apiData[0].name})</h4>
            <p style={{fontSize: '12px', color: '#666'}}>{apiData[0].image_url}</p>
            <img 
              src={apiData[0].image_url} 
              alt={apiData[0].name}
              style={{ width: '200px', height: '150px', objectFit: 'cover' }}
              onLoad={() => console.log('✅ API Image loaded:', apiData[0].image_url)}
              onError={(e) => {
                console.log('❌ API Image failed:', apiData[0].image_url, e);
                e.target.style.border = '2px solid red';
              }}
            />
          </div>
        )}
        
      </div>
    </div>
  );
}

export default TestImageComponent;