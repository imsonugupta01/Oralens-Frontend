import React, { useEffect, useState } from 'react';

function Organization() {
  const [organizations, setOrganizations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrganizations = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/organization/findAll`);
        if (!response.ok) throw new Error('Failed to fetch organizations');
        const data = await response.json();
        setOrganizations(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchOrganizations();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <p className="text-xl text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">


      <div className="container mx-auto px-4 py-8">
        {/* Total Organizations */}
       

        {/* Organizations Table */}
        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <table className="w-full text-left table-auto">
            <thead className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
              <tr>
                <th className="px-4 py-2 text-lg text-center">#</th>
                <th className="px-4 py-2 text-lg text-center">Name</th>
                <th className="px-4 py-2 text-lg text-center">Email</th>
                <th className="px-4 py-2 text-lg text-center">Location</th>
              </tr>
            </thead>
            <tbody>
              {organizations.map((org, index) => (
                <tr
                  key={org._id}
                  className={`border-b ${
                    index % 2 === 0 ? 'bg-gray-100' : 'bg-white'
                  } text-center`}
                >
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2 font-semibold text-center text-gray-800">
                    {org.name}
                  </td>
                  <td className="px-4 py-2 text-gray-700 text-center">{org.email}</td>
                  <td className="px-4 py-2 text-gray-700 text-center">{org.location}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Organization;
