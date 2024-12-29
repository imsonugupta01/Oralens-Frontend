import React from "react";
import { useNavigate } from "react-router-dom";

function Landing() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      {/* Header Section */}
      <header className="bg-blue-600 text-white  shadow-md">
        <div className="container mx-4 py-4">
          <h1 className="text-2xl font-bold">Dashboard</h1>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex flex-col justify-center items-center flex-grow px-4">
        <div className="bg-white shadow-2xl rounded-2xl p-10 w-full max-w-3xl">
          {/* Card Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl font-extrabold text-gray-800 mb-4">
              Welcome to the Dashboard
            </h1>
            <p className="text-gray-600 text-lg">
              Manage organizations, teams, and individual profiles easily.
            </p>
          </div>

          {/* Options Section */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

          <div
              className="bg-pink-100 hover:bg-pink-200 text-pink-600 font-semibold rounded-lg shadow-md p-6 cursor-pointer"
              onClick={()=>{navigate("/Explore")}}
            >
              <div className="text-center" >
                <h2 className="text-2xl mb-2">Explore</h2>
                <p>Discover features and learn more.</p>
              </div>
            </div>
            <div
              className="bg-blue-100 hover:bg-blue-200 text-blue-600 font-semibold rounded-lg shadow-md p-6 cursor-pointer"
              onClick={() => {
                navigate("/Register-Organization");
              }}
            >
              <div className="text-center">
                <h2 className="text-2xl mb-2">Register Organization</h2>
                <p>Sign up an organization and add teams.</p>
              </div>
            </div>
            <div
              className="bg-purple-100 hover:bg-purple-200 text-purple-600 font-semibold rounded-lg shadow-md p-6 cursor-pointer"
            >
              <div className="text-center" onClick={()=>{navigate("/Member-Login")}}>
                <h2 className="text-2xl mb-2">Member Login</h2>
                <p>Log in to your account as an individual.</p>
              </div>
            </div>
           
            <div
              className="bg-green-100 hover:bg-green-200 text-green-600 font-semibold rounded-lg shadow-md p-6 cursor-pointer"
              onClick={() => {
                navigate("/Organization-Login");
              }}
            >
              <div className="text-center">
                <h2 className="text-2xl mb-2">Login as Organization</h2>
                <p>Access your organization's dashboard.</p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default Landing;
