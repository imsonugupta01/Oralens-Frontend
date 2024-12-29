import React, { useState, useEffect } from 'react';
import Teams from './Teams';
import Members from './Members';
import { useNavigate } from 'react-router-dom';

function Explore() {
  const [activeTab, setActiveTab] = useState('Organization'); // Default active tab
  const [organizations, setOrganizations] = useState([]);
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [selectedOrganization, setSelectedOrganization] = useState(null);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/get/${selectedOrganization}`);
        if (!response.ok) throw new Error('Failed to fetch teams');
        const data = await response.json();
        setTeams(data);
        setSelectedTeam(null); // Reset selected team
        setMembers([]); // Clear members
      } catch (err) {
        setError(err.message);
      }
    };

    fetchTeams();
  }, [selectedOrganization]);

  // Fetch members when a team is selected
  useEffect(() => {
    if (!selectedTeam) return;

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/findAll`);
        if (!response.ok) throw new Error('Failed to fetch members');
        const data = await response.json();
        const filteredMembers = data.filter((member) => member.teamId === selectedTeam);
        setMembers(filteredMembers);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchMembers();
  }, [selectedTeam]);

  const navigate = useNavigate();
  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300">
      {/* Header */}
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
        <h1 className="text-2xl font-bold">Explore</h1>
        <button
          className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
          onClick={handleLogout}
        >
          Home
        </button>
      </header>

      {/* Tabs */}
      <div className="bg-white shadow-md py-3 mb-6 mt-20 rounded-lg">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-6">
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === 'Organization'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 bg-gray-200 hover:bg-blue-200'
              }`}
              onClick={() => setActiveTab('Organization')}
            >
              Organization
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === 'Teams'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 bg-gray-200 hover:bg-blue-200'
              }`}
              onClick={() => setActiveTab('Teams')}
            >
              Teams
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 rounded-lg transition duration-200 ${
                activeTab === 'Members'
                  ? 'text-white bg-blue-600'
                  : 'text-gray-700 bg-gray-200 hover:bg-blue-200'
              }`}
              onClick={() => setActiveTab('Members')}
            >
              Members
            </button>
          </div>
        </div>
      </div>

      {/* Tab Content */}
      <div className="container mx-auto px-6">
        {activeTab === 'Organization' && (
          <div>
            {/* Organizations Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
              {organizations.map((org) => (
                <div
                  key={org._id}
                  className="bg-gray-100 text-black shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow duration-300 cursor-pointer"
                  onClick={() => setSelectedOrganization(org._id)}
                >
                  <h3 className="text-lg font-bold">{org.name}</h3>
                  <p>Email: {org.email}</p>
                  <p>Location: {org.location}</p>
                </div>
              ))}
            </div>

            {/* Teams Cards */}
            {selectedOrganization && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Teams</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {teams.map((team) => (
                    <div
                      key={team._id}
                      className={`shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow duration-300 cursor-pointer ${
                        selectedTeam === team._id ? 'bg-blue-800 text-white' : 'bg-blue-500 text-white'
                      }`}
                      onClick={() => setSelectedTeam(team._id)}
                    >
                      <h3 className="text-lg font-bold">{team.teamName}</h3>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Members Cards */}
            {selectedTeam && (
              <div className="mt-6">
                <h2 className="text-2xl font-bold text-gray-700 mb-4">Members</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {members.map((member) => (
                    <div
                      key={member._id}
                      className="bg-gray-100 text-black shadow-lg rounded-lg p-4 border border-gray-300 hover:shadow-xl transition-shadow duration-300"
                    >
                      <img
                        src={member.imageUrl}
                        alt={member.name}
                        className="w-16 h-16 rounded-full mx-auto mb-4 border border-gray-300"
                      />
                      <h3 className="text-lg font-bold text-center">{member.name}</h3>
                      <p className="text-center">{member.email}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'Teams' && (
          <div className="container mx-auto px-6">
            <Teams />
          </div>
        )}

        {activeTab === 'Members' && (
          <div className="container mx-auto px-6">
            <Members />
          </div>
        )}
      </div>
    </div>
  );
}

export default Explore;
