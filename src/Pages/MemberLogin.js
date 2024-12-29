import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

function MemberLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate=useNavigate()
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        // Assuming the response contains a success message or token
        alert('Login successful');
        // console.log(data); // Handle the response data as needed
        navigate(`/Profile/${data.member.id}`)
      } else {
        const data = await response.json();
        setError(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col ">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-4 shadow-md">
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-3xl font-bold">Member Login</h1>
        </div>
      </header>

      {/* Login Form Section */}
      <div className="flex justify-center items-center mt-12">
        <div className="bg-white p-8 rounded-md shadow-lg w-full max-w-sm">
          <h2 className="text-2xl font-semibold text-center mb-6">Login to Your Account</h2>

          {/* Error message */}
          {error && <p className="text-red-600 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                placeholder="Enter your email"
                required
              />
            </div>

            <div className="mb-6">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={handlePasswordChange}
                className="w-full p-3 border border-gray-300 rounded-md mt-2"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="mb-4">
              <button
                type="submit"
                className={`w-full py-3 text-white rounded-md ${loading ? 'bg-gray-500' : 'bg-blue-600'} hover:bg-blue-700 transition duration-300`}
                disabled={loading}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default MemberLogin;
