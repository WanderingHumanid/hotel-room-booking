import React, { useState, useEffect, useCallback, useRef } from 'react';
import api from '../api';

function HotelSearch({ onSearchResults, onClearSearch }) {
  const [searchParams, setSearchParams] = useState({
    name: '',
    location: '',
    checkIn: '',
    checkOut: ''
  });
  const [isSearching, setIsSearching] = useState(false);
  const [searchPerformed, setSearchPerformed] = useState(false);
  const searchTimeoutRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSearch = useCallback(async (e) => {
    e.preventDefault();
    
    // Check if at least one search parameter is provided
    if (!searchParams.name && !searchParams.location && !searchParams.checkIn && !searchParams.checkOut) {
      return;
    }

    setIsSearching(true);
    
    try {
      const params = new URLSearchParams();
      
      if (searchParams.name) params.append('name', searchParams.name);
      if (searchParams.location) params.append('location', searchParams.location);
      if (searchParams.checkIn) params.append('check_in', searchParams.checkIn);
      if (searchParams.checkOut) params.append('check_out', searchParams.checkOut);

      const response = await api.get(`hotels/search/?${params.toString()}`);
      onSearchResults(response.data);
      setSearchPerformed(true);
    } catch (error) {
      console.error('Error searching hotels:', error);
      onSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  }, [searchParams, onSearchResults]);

  const handleClearSearch = () => {
    setSearchParams({
      name: '',
      location: '',
      checkIn: '',
      checkOut: ''
    });
    setSearchPerformed(false);
    onClearSearch();
  };

  // Auto-search when user types (with debounce)
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      if ((searchParams.name || searchParams.location) && !isSearching) {
        // Create a simple search function to avoid dependency issues
        const performSearch = async () => {
          try {
            const params = new URLSearchParams();
            if (searchParams.name) params.append('name', searchParams.name);
            if (searchParams.location) params.append('location', searchParams.location);
            const response = await api.get(`hotels/search/?${params.toString()}`);
            onSearchResults(response.data);
            setSearchPerformed(true);
          } catch (error) {
            console.error('Error searching hotels:', error);
            onSearchResults([]);
          }
        };
        performSearch();
      }
    }, 500);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchParams.name, searchParams.location, onSearchResults, isSearching]);

  return (
    <div className="search-sidebar">
      <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 700, color: '#2d3748' }}>
        Search Hotels
      </h3>
      <form onSubmit={handleSearch} className="search-form">
        <div className="search-row">
          <div className="search-field">
            <label htmlFor="hotelName">Hotel Name</label>
            <input
              type="text"
              id="hotelName"
              name="name"
              value={searchParams.name}
              onChange={handleInputChange}
              placeholder="Search by hotel name..."
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="location">Location</label>
            <input
              type="text"
              id="location"
              name="location"
              value={searchParams.location}
              onChange={handleInputChange}
              placeholder="Search by location..."
              className="search-input"
            />
          </div>
        </div>

        <div className="search-row">
          <div className="search-field">
            <label htmlFor="checkIn">Check-in Date</label>
            <input
              type="date"
              id="checkIn"
              name="checkIn"
              value={searchParams.checkIn}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
          
          <div className="search-field">
            <label htmlFor="checkOut">Check-out Date</label>
            <input
              type="date"
              id="checkOut"
              name="checkOut"
              value={searchParams.checkOut}
              onChange={handleInputChange}
              className="search-input"
            />
          </div>
        </div>

        <div className="search-buttons">
          <button 
            type="submit" 
            className="search-btn"
            disabled={isSearching || (!searchParams.name && !searchParams.location && !searchParams.checkIn && !searchParams.checkOut)}
          >
            {isSearching ? 'Searching...' : 'Search Hotels'}
          </button>
          
          {searchPerformed && (
            <button 
              type="button" 
              className="clear-btn"
              onClick={handleClearSearch}
            >
              Show All Hotels
            </button>
          )}
        </div>
      </form>
    </div>
  );
}

export default HotelSearch;