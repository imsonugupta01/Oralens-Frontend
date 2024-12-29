import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function OrganizationLogin() {
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };
  const navigate=useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');  // Clear any previous errors

    // API call to login the organization
    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/organization/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Login successful:', data);
        alert('Login successful!');
        navigate(`/Oganization-Profile/${data.organization.id}`)
        // You can redirect the user to a different page after successful login
        // window.location.href = "/dashboard"; // or use React Router
      } else {
        setError(data.error || 'Login failed');
      }
    } catch (error) {
      setError('Server error, please try again later');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-600 text-white py-6 shadow-md">
        <div className="container mx-2">
          <h1 className="text-2xl font-extrabold">Organization Login</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-grow flex items-center justify-center">
        <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-md">
          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={credentials.email}
                onChange={handleChange}
                placeholder="Enter your email"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleChange}
                placeholder="Enter your password"
                required
                className="mt-2 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Error Message */}
            {error && (
              <div className="text-red-500 text-sm text-center mt-4">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full ${loading ? 'bg-gray-400' : 'bg-blue-500'} text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2`}
              >
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </div>
          </form>

          {/* Footer */}
          <div className="text-center text-gray-600 mt-4">
            <p>
              Don't have an account?{' '}
              <a href="/Register-Organization" className="text-blue-500">
                Register here
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default OrganizationLogin;
