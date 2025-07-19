import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import '../styles/AuthForms.css';

const Signup = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    age: '', gender: 'male', phone: ''
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');

    try {
      const res = await axios.post('http://localhost:5000/api/auth/signup', form);
      localStorage.setItem('token', res.data.token);
      localStorage.removeItem('sessionId');
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="auth-form-container">
      <h2>Signup</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          placeholder="Name"
          value={form.name}
          onChange={handleChange}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          type="text"
          name="email"
          id="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
        />

        <label htmlFor="password">Password</label>
        <input
          type="password"
          name="password"
          id="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
        />

        <label htmlFor="age">Age</label>
        <input
          type="text"
          name="age"
          id="age"
          placeholder="Age"
          value={form.age}
          onChange={handleChange}
          required
        />

        <label htmlFor="phone">Phone</label>
        <input
          type="text"
          name="phone"
          id="phone"
          placeholder="Phone"
          value={form.phone}
          onChange={handleChange}
          required
        />

        <label htmlFor="gender">Gender</label>
        <select
          name="gender"
          id="gender"
          value={form.gender}
          onChange={handleChange}
          required
        >
          <option value="male">Male</option>
          <option value="female">Female</option>
          <option value="cant disclose">Can't Disclose</option>
        </select>

        <button type="submit">Sign Up</button>
        {error && <p className="error">{error}</p>}
      </form>

      <p className="auth-switch">
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Signup;
