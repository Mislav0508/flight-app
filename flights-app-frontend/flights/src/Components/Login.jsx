import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login } from '../features/userSlice';
import './Login.css';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({ name: '', email: '', password: '' });

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const validateName = () => {
    return name.length > 0;
  };

  const validateEmail = () => {
    // Simple email regex pattern
    const pattern = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    return pattern.test(email);
  };

  const validatePassword = () => {
    return password.length >= 6;
  };

  const handleLogin = () => {
    if (validateName() && validateEmail() && validatePassword()) {
      dispatch(
        login({
          user: {
            name,
            email,
            password,
            loggedIn: true,
          },
          token: 'test token',
        }),
      );
      setErrors({ name: '', email: '', password: '' });
      navigate("/dashboard")
    } else {
      setErrors({
        name: validateName() ? '' : 'Name is required.',
        email: validateEmail() ? '' : 'Please enter a valid email.',
        password: validatePassword() ? '' : 'Password must be at least 6 characters long.',
      });
    }
  };

  return (
    <div className="login">
      <form className="login__form">
        <h1>Login Here</h1>

        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        {errors.name && <p className="error">{errors.name}</p>}

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        {errors.email && <p className="error">{errors.email}</p>}

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {errors.password && <p className="error">{errors.password}</p>}

        <Link
          style={{ textDecoration: 'none' }}
          to="/dashboard"
          onClick={(e) => {
            e.preventDefault();
            handleLogin();
          }}
        >
          <Button variant="contained" type="submit">
            Login
          </Button>
        </Link>
      </form>
    </div>
  );
};

export default Login;
