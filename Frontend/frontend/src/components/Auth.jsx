import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';

const Auth = () => {
  const navigate = useNavigate();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    lastName: ''
  });

  const toggleAuthMode = () => {
    setIsLogin(!isLogin);
    setFormData({ email: '', password: '', name: '', lastName: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = isLogin ? `${API_URL}/login` : `${API_URL}/register`;
    const body = isLogin
      ? { email: formData.email, password: formData.password }
      : { ...formData };

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await response.json();
      if (response.ok) {
        localStorage.setItem('token', data.token);
        
        // Decode JWT token to get user role
        try {
          const tokenPayload = JSON.parse(atob(data.token.split('.')[1]));
          console.log('Token payload:', tokenPayload); // Debug log
          const userRole = tokenPayload.role;
          console.log('User role:', userRole); // Debug log
          
          // Redirect based on user role
          if (userRole === 'admin') {
            navigate('/admin');
          } else {
            navigate('/user');
          }
        } catch (decodeError) {
          console.error('Error decoding token:', decodeError);
          alert('Login successful, but failed to redirect. Please refresh the page.');
        }
      } else {
        alert(data.error || 'An error occurred');
      }
    } catch (error) {
      alert('An error occurred');
    }
  };

  return (
    <div>
      <h1>{isLogin ? 'Login' : 'Register'}</h1>
      <form onSubmit={handleSubmit}>
        {!isLogin && (
          <>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="lastName"
              placeholder="Last Name"
              value={formData.lastName}
              onChange={handleInputChange}
              required
            />
          </>
        )}
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={formData.email}
          onChange={handleInputChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleInputChange}
          required
        />
        <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
      </form>
      <button onClick={toggleAuthMode}>
        {isLogin ? 'Switch to Register' : 'Switch to Login'}
      </button>
    </div>
  );
};

export default Auth;