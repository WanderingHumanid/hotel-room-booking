import React, { useState } from 'react';
import api from '../api';

export default function AuthModal({ onClose, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    first_name: '',
    last_name: '',
    phone: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [stayLoggedIn, setStayLoggedIn] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        // Login
        const response = await api.post('auth/verify/', {
          email: formData.email,
          password: formData.password
        });
        
        const userData = {
          ...response.data.guest,
          stayLoggedIn
        };
        
        // Store user data in localStorage if stay logged in is checked
        if (stayLoggedIn) {
          localStorage.setItem('luxestay_user', JSON.stringify(userData));
        } else {
          sessionStorage.setItem('luxestay_user', JSON.stringify(userData));
        }
        
        onLogin(userData);
        onClose();
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }
        
        if (formData.password.length < 6) {
          setError('Password must be at least 6 characters long');
          setLoading(false);
          return;
        }

        const signupData = {
          first_name: formData.first_name,
          last_name: formData.last_name,
          email: formData.email,
          phone: formData.phone,
          password: formData.password
        };

        try {
          const response = await api.post('guests/', signupData);
          console.log('Guest created successfully:', response.data);
          
          // Wait a moment before attempting auto-login to ensure the account is properly saved
          await new Promise(resolve => setTimeout(resolve, 500));
          
          // Auto-login after signup
          const loginResponse = await api.post('auth/verify/', {
            email: formData.email,
            password: formData.password
          });
          
          const userData = {
            ...loginResponse.data.guest,
            stayLoggedIn
          };
          
          if (stayLoggedIn) {
            localStorage.setItem('luxestay_user', JSON.stringify(userData));
          } else {
            sessionStorage.setItem('luxestay_user', JSON.stringify(userData));
          }
          
          onLogin(userData);
          onClose();
        } catch (loginError) {
          console.error('Auto-login failed:', loginError);
          // If auto-login fails, still show success but don't auto-login
          setError('✅ Account created successfully! Please sign in with your new credentials.');
          setIsLogin(true); // Switch to login mode
          setFormData(prev => ({
            ...prev,
            first_name: '',
            last_name: '',
            phone: '',
            confirmPassword: ''
          }));
        }
      }
    } catch (err) {
      console.error('Authentication error:', err);
      if (err.response?.status === 401) {
        setError('Invalid email or password');
      } else if (err.response?.status === 404) {
        setError('No account found with this email');
      } else if (err.response?.data?.email) {
        setError('An account with this email already exists');
      } else if (err.response?.data?.error) {
        setError(err.response.data.error);
      } else {
        setError(isLogin ? 'Login failed. Please try again.' : 'Signup failed. Please try again.');
      }
    }
    setLoading(false);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="modal-content"
        onClick={e => e.stopPropagation()}
        style={{
          padding: '32px 28px 24px 28px',
          minWidth: 420,
          maxWidth: 480,
          width: '95vw',
          maxHeight: '90vh',
          overflowY: 'auto',
          borderRadius: 20,
          position: 'relative',
        }}
      >
        <button className="modal-close" onClick={onClose}>&times;</button>
        
        <h2 style={{textAlign: 'center', marginBottom: '24px', fontSize: '1.8rem'}}>
          {isLogin ? 'Welcome Back' : 'Join LuxeStay'}
        </h2>
        
        <form onSubmit={handleSubmit} className="modal-user-form">
          {!isLogin && (
            <>
              <div style={{
                display: 'flex', 
                gap: '12px',
                flexWrap: 'wrap'
              }}>
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  style={{
                    flex: '1',
                    minWidth: '140px'
                  }}
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  style={{
                    flex: '1',
                    minWidth: '140px'
                  }}
                />
              </div>
              <input
                type="text"
                name="phone"
                placeholder="Phone Number"
                value={formData.phone}
                onChange={handleChange}
                required
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            value={formData.email}
            onChange={handleChange}
            required
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            required
            minLength={6}
          />
          
          {!isLogin && (
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          )}
          
          <div style={{
            display: 'flex', 
            alignItems: 'center', 
            gap: '8px', 
            margin: '8px 0',
            justifyContent: 'flex-start',
            width: '100%'
          }}>
            <input
              type="checkbox"
              id="stayLoggedIn"
              checked={stayLoggedIn}
              onChange={(e) => setStayLoggedIn(e.target.checked)}
              style={{
                margin: 0,
                width: 'auto',
                flex: 'none'
              }}
            />
            <label 
              htmlFor="stayLoggedIn" 
              style={{
                fontSize: '0.95rem', 
                color: '#666',
                margin: 0,
                cursor: 'pointer',
                userSelect: 'none',
                flex: 'none'
              }}
            >
              Stay logged in
            </label>
          </div>
          
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
          </button>
          
          {error && (
            <div style={{color: '#d32f2f', textAlign: 'center', marginTop: '12px', fontWeight: 600}}>
              {error}
            </div>
          )}
        </form>
        
        <div style={{textAlign: 'center', marginTop: '20px'}}>
          <button
            type="button"
            onClick={() => setIsLogin(!isLogin)}
            style={{
              background: 'none',
              border: 'none',
              color: '#0073e6',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontSize: '1rem'
            }}
          >
            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
          </button>
        </div>
      </div>
    </div>
  );
}