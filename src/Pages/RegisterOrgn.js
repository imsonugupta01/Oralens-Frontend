import React, { useState } from "react";

function RegisterOrgn() {
  const [organization, setOrganization] = useState({
    name: "",
    email: "",
    location: "",
    password: "", // Added password field
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setOrganization({ ...organization, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Organization Registered:", organization);

    // Make POST request to the server
    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/organization/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(organization),
      });

      if (response.ok) {
        // Success message
        alert("Organization Registered Successfully!");
        setOrganization({ name: "", email: "", location: "", password: "" });
      } else {
        // Handle errors from the server
        const errorData = await response.json();
        alert(`Error: ${errorData.error}`);
      }
    } catch (err) {
      // Handle any network errors
      console.error(err);
      alert("An error occurred while registering the organization.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header */}
      <header className="bg-blue-600 text-white shadow-md">
        <div className="container mx-4 py-4">
          <h1 className="text-2xl font-bold">Register Organization</h1>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex justify-center items-center mt-16">
        <div className="bg-white shadow-md rounded-lg p-2 w-full max-w-md">
          <h2 className="text-2xl font-bold text-gray-800 text-center mb-6">
            Register Organization
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Organization Name */}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-medium text-gray-700"
              >
                Organization Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={organization.name}
                onChange={handleChange}
                placeholder="Enter organization name"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={organization.email}
                onChange={handleChange}
                placeholder="Enter email address"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Location */}
            <div>
              <label
                htmlFor="location"
                className="block text-sm font-medium text-gray-700"
              >
                Location
              </label>
              <input
                type="text"
                id="location"
                name="location"
                value={organization.location}
                onChange={handleChange}
                placeholder="Enter location"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={organization.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2"
              >
                Register
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterOrgn;
