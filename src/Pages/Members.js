import React, { useState, useEffect } from 'react';

function Members() {
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [teamsLoading, setTeamsLoading] = useState(false);
  const [membersLoading, setMembersLoading] = useState(false);

  // Fetch organizations
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

  // Fetch teams when an organization is selected
  useEffect(() => {
    if (!selectedOrganization) return;

    const fetchTeams = async () => {
      try {
        setTeamsLoading(true);
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/get/${selectedOrganization}`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        setTeams(data);
        setSelectedTeam(''); // Reset team selection
      } catch (err) {
        setError(err.message);
      } finally {
        setTeamsLoading(false);
      }
    };

    fetchTeams();
  }, [selectedOrganization]);

  // Fetch members when a team is selected
  useEffect(() => {
    if (!selectedTeam) return;

    const fetchMembers = async () => {
      try {
        setMembersLoading(true);
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/findAll`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        const filteredMembers = data.filter((member) => member.teamId === selectedTeam);
        setMembers(filteredMembers);
      } catch (err) {
        setError(err.message);
      } finally {
        setMembersLoading(false);
      }
    };

    fetchMembers();
  }, [selectedTeam]);

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
          <h1 className="text-3xl font-bold">Members</h1>
        </div>
      </header>

      <div className="container mx-auto px-4 py-4">
        {/* Organization Dropdown */}
        <div className="mb-4">
          <label htmlFor="organization-select" className="block text-lg font-semibold text-gray-800 mb-2">
            Select an Organization:
          </label>
          <select
            id="organization-select"
            value={selectedOrganization}
            onChange={(e) => setSelectedOrganization(e.target.value)}
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

        {/* Teams Dropdown */}
        {teams.length > 0 && (
          <div className="mb-6">
            <label htmlFor="team-select" className="block text-lg font-semibold text-gray-800 mb-2">
              Select a Team:
            </label>
            <select
              id="team-select"
              value={selectedTeam}
              onChange={(e) => setSelectedTeam(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" disabled>
                -- Choose a Team --
              </option>
              {teams.map((team) => (
                <option key={team._id} value={team._id}>
                  {team.teamName}
                </option>
              ))}
            </select>
          </div>
        )}

        {/* Members List */}
        {membersLoading ? (
          <div className="text-center py-4">
            <p className="text-xl text-gray-600">Loading members...</p>
          </div>
        ) : members.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {members.map((member) => (
              <div
                key={member._id}
                className="bg-white shadow-md rounded-lg p-4 flex flex-col items-center text-center"
              >
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="w-24 h-24 rounded-full mb-4"
                />
                <h3 className="text-lg font-semibold text-gray-800">{member.name}</h3>
                <p className="text-gray-600">{member.email}</p>
              </div>
            ))}
          </div>
        ) : selectedTeam ? (
          <div className="text-center py-4">
            <p className="text-xl text-gray-600">No members found for this team.</p>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default Members;
