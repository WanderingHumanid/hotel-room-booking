import React from 'react';
import './HotelBooking.css';

export default function AboutUs() {
  return (
    <div className="aboutus-container">
      <div className="aboutus-hero">
        <h1>About Us</h1>
        <p className="aboutus-tagline">Your trusted partner for seamless hotel bookings and memorable stays.</p>
      </div>
      <div className="aboutus-content">
        <h2>Who We Are</h2>
        <p>
          <b>[Hotel_Booking]</b> is a modern hotel booking platform designed to make your travel experience effortless and enjoyable. Built with the latest web technologies, our mission is to connect travelers with the best hotels and rooms, offering a smooth, intuitive, and visually stunning interface.
        </p>
        <h2>Our Vision</h2>
        <p>
          We believe booking a room should be as relaxing as your stay. Our platform is crafted for speed, reliability, and ease of use, ensuring you find the perfect room at the best price, every time.
        </p>
        <h2>Why Choose Us?</h2>
        <ul>
          <li>Beautiful, responsive, and user-friendly design</li>
          <li>Real-time room availability and instant booking</li>
          <li>Secure guest management and booking history</li>
          <li>Modern tech stack: React, Django, MySQL</li>
          <li>Dedicated to privacy, security, and transparency</li>
        </ul>
      </div>
    </div>
  );
}
