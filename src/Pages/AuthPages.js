import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext'; // import AuthContext
import api from '../utils/axiosInstance'; // import axios instance
import Header from '../components/Header';
import Footer from '../components/Footer';
import axios from 'axios'

export const mergeCartOnLogin = async (token) => {
  const localCart = JSON.parse(localStorage.getItem('cart')) || [];

  if (localCart.length === 0) return;

  try {
    await axios.post(
      `${process.env.REACT_APP_BACKEND_URL}/cart/merge`,
      { items: localCart },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Clear the local storage cart after merging
    localStorage.removeItem('cart');
    console.log('Cart merged successfully');
  } catch (error) {
    console.error('Error merging cart:', error);
  }
};

const AuthLayout = ({ children }) => (
  <div className="min-h-screen flex flex-col">
    <Header />
    <main className="flex-1 flex items-center justify-center bg-gray-50 py-12 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-8">
        {children}
      </div>
    </main>
    <Footer />
  </div>
);



const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Access login function from context
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission
    try {
      console.log(process.env.REACT_APP_BACKEND_URL)
      const response = await axios.post(process.env.REACT_APP_BACKEND_URL + '/login', {
        identifier: email,
        password,
      });

      console.log(response.data)
      localStorage.setItem('accessToken', response.data.access_token);
      localStorage.setItem('refreshToken', response.data.refresh_token);
      login(response.data.access_token, response.data.refresh_token)
      // Merge the cart after login
      await mergeCartOnLogin(response.data.access_token);

      // Redirect to the previous page or homepage
      navigate('/');
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.msg || 'Login failed');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Login</h2>
          <p className="mt-2 text-gray-600">to get started</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        <form className="space-y-4" onSubmit={handleLogin}>
          <div>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Continue
          </button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600">New User? </span>
          <Link to="/signup" className="text-green-600 hover:text-green-700 font-medium">
            Register
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};


const SignupPage = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    try {
      await api.post(process.env.REACT_APP_BACKEND_URL + '/register', {
        username,
        email,
        password,
      });
      setSuccess('Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000); // Redirect to login after 2 seconds
    } catch (err) {
      setError(err.response?.data?.msg || 'Signup failed');
    }
  };

  return (
    <AuthLayout>
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-3xl font-semibold text-gray-900">Signup</h2>
          <p className="mt-2 text-gray-600">to get started</p>
        </div>
        {error && <p className="text-red-500 text-center">{error}</p>}
        {success && <p className="text-green-500 text-center">{success}</p>}
        <form className="space-y-4" onSubmit={handleSignup}>
          <div>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm Password"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
              className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-600">
              Agree to Our Terms and Conditions
            </label>
          </div>
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600 transition-colors"
          >
            Continue
          </button>
        </form>
        <div className="text-center text-sm">
          <span className="text-gray-600">Already registered? </span>
          <Link to="/login" className="text-green-600 hover:text-green-700 font-medium">
            Login
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export { LoginPage, SignupPage };
