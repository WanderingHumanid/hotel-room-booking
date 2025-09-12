import React from 'react';
import './HotelBooking.css';

export default function AboutUs() {
  return (
    <div className="aboutus-container">
      <div className="aboutus-hero">
        <h1>About LuxeStay</h1>
        <p className="aboutus-tagline">Redefining luxury travel with seamless booking experiences and unforgettable stays.</p>
      </div>
      <div className="aboutus-content">
        <h2>🏨 Who We Are</h2>
        <p>
          <strong>LuxeStay</strong> is a premium hotel booking platform that bridges the gap between luxury and accessibility. We leverage cutting-edge technology to deliver personalized travel experiences, connecting discerning travelers with exceptional accommodations worldwide.
        </p>

        <h2>✨ Our Mission</h2>
        <p>
          To transform how people discover and book their perfect stays. We believe every journey should begin with confidence and excitement, not frustration and uncertainty.
        </p>

        <h2>🌟 What Makes Us Different</h2>
        <ul>
          <li><strong>Intuitive Design:</strong> Beautiful, responsive interface that makes booking effortless</li>
          <li><strong>Instant Booking:</strong> Real-time availability with immediate confirmation</li>
          <li><strong>Secure & Private:</strong> Bank-level security protecting your personal information</li>
          <li><strong>Modern Technology:</strong> Built with React, Django, and MySQL for peak performance</li>
        </ul>

        <h2>🎯 Our Commitment</h2>
        <p>
          We're dedicated to providing transparent pricing, exceptional customer service, and a booking experience that exceeds expectations. Your perfect stay is just a few clicks away.
        </p>
      </div>
    </div>
  );
}
