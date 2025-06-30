import React from 'react';
import './HotelBooking.css';

export default function AboutUs() {
  return (
    <div className="aboutus-container">
      <div className="aboutus-hero">
        <img src={process.env.PUBLIC_URL + '/logo.png'} alt="A10 Roomz Logo" className="aboutus-logo" />
        <h1>About A10 ROOMZ</h1>
        <p className="aboutus-tagline">Your trusted partner for seamless hotel bookings and memorable stays.</p>
      </div>
      <div className="aboutus-content">
        <h2>Who We Are</h2>
        <p>
          <b>A10 ROOMZ</b> is a modern hotel booking platform designed to make your travel experience effortless and enjoyable. Built with the latest web technologies, our mission is to connect travelers with the best hotels and rooms, offering a smooth, intuitive, and visually stunning interface.
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
        <h2>Meet the Creator</h2>
        <p>
          <b>Vishnu</b> is a passionate full-stack developer and the creator of A10 ROOMZ. This project is a learning journey in modern web development, with a focus on clean code, beautiful UI, and practical features. Special thanks to mentor Ms. Anjusha V L for guidance and support.
        </p>
        <h2>Contact</h2>
        <p>
          Have questions or feedback? Reach out at <a href="mailto:contact@a10roomz.com">contact@a10roomz.com</a> or connect on <a href="https://github.com/">GitHub</a>.
        </p>
      </div>
    </div>
  );
}
