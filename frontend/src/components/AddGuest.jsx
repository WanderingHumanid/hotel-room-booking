import React, { useState } from 'react';
import api from '../api';

function AddGuest() {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    phone: '',
  });

  const [status, setStatus] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    api.post('guests/', formData)
      .then(() => {
        setStatus('Guest added successfully!');
        setFormData({ first_name: '', last_name: '', email: '', phone: '' });
      })
      .catch(() => {
        setStatus('Error adding guest.');
      });
  };

  return (
    <div>
      <h2>Add Guest</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" name="first_name" placeholder="First Name" value={formData.first_name} onChange={handleChange} required />
        <input type="text" name="last_name" placeholder="Last Name" value={formData.last_name} onChange={handleChange} required />
        <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} required />
        <input type="text" name="phone" placeholder="Phone" value={formData.phone} onChange={handleChange} required />
        <button type="submit">Add Guest</button>
      </form>
      {status && <p>{status}</p>}
    </div>
  );
}

export default AddGuest;
