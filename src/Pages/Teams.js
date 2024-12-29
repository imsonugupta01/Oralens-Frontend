import React, { useEffect, useState } from 'react';

function Teams() {
  const [organizations, setOrganizations] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [teams, setTeams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamsLoading, setTeamsLoading] = useState(false);

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

  const handleOrganizationChange = async (event) => {
    const organizationId = event.target.value;
    setSelectedOrganization(organizationId);
    setTeams([]);
    if (!organizationId) return;

    try {
      setTeamsLoading(true);
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/get/${organizationId}`);
      if (!response.ok) throw new Error('Failed to fetch teams');
      const data = await response.json();
      setTeams(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setTeamsLoading(false);
    }
  };

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
    <div className=" bg-gray-100">
      <header className="bg-blue-600 text-white py-1 shadow-md">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold">Teams</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Dropdown for Organizations */}
        <div className="mb-6">
          <label htmlFor="organization-select" className="block text-lg font-semibold text-gray-800 mb-2">
            Select an Organization:
          </label>
          <select
            id="organization-select"
            value={selectedOrganization}
            onChange={handleOrganizationChange}
            className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="" disabled>
              -- Choose an Organization --
            </option>
            {organizations.map((org) => (
              <option key={org._id} value={org._id}>
                {org.name}
              </option>
            ))}
          </select>
        </div>

        {/* Teams Section */}
        {teamsLoading ? (
          <div className="text-center py-4">
            <p className="text-xl text-gray-600">Loading teams...</p>
          </div>
        ) : (
          teams.length > 0 && (
            <div className="bg-white shadow-md rounded-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Teams</h2>
              <ul className="space-y-2">
                {teams.map((team) => (
                  <li
                    key={team._id}
                    className="border border-gray-300 rounded-lg p-4 text-gray-700 flex justify-between items-center"
                  >
                    <span className="font-medium">{team.teamName}</span>
                    <span className="text-sm text-gray-500">Team ID: {team._id}</span>
                  </li>
                ))}
              </ul>
            </div>
          )
        )}

        {/* No Teams Message */}
        {selectedOrganization && !teamsLoading && teams.length === 0 && (
          <div className="text-center py-4">
            <p className="text-xl text-gray-600">No teams found for this organization.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Teams;
