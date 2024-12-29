import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import AddTeam from './AddTeam';
import AllTeams from './AllTeams';
import AllMembers from './AllMembers';

function OrganizationProfile() {
  const { Id } = useParams(); // Extract organization Id from the URL
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('Teams'); // Default active tab
  const [teamName, setTeamName] = useState(''); // State to hold the team name
  const navigate=useNavigate()
  useEffect(() => {
    const fetchOrganization = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/organization/getById/${Id}`);
        const data = await response.json();

        if (response.ok) {
          setOrganization(data); // Set organization data if successful
        } else {
          setError(data.error || 'Failed to fetch organization details');
        }
      } catch (error) {
        setError('Server error, please try again later');
        console.error('Error fetching organization:', error);
      } finally {
        setLoading(false); // Stop loading once the request is completed
      }
    };

    fetchOrganization();
  }, [Id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-xl text-red-500">{error}</p>
      </div>
    );
  }
    
  return (
    <div className="min-h-screen bg-gray-100">
 <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
      <h1 className="text-xl font-bold">Explore</h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
         onClick={()=>{navigate("/")}}
      >
        Logout
      </button>
    </header>
  



      <div className="bg-white shadow-md py-3 mb-6 mt-20">
        <div className="container mx-auto px-6">
          <div className="flex justify-center space-x-6 border-b border-gray-200">
            <button
              className={`text-lg font-semibold px-4 py-2 ${activeTab === 'Teams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Teams')}
            >
              Teams
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 ${activeTab === 'Members' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Members')}
            >
              Members
            </button>
            <button
              className={`text-lg font-semibold px-4 py-2 ${activeTab === 'Add Teams' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-700'}`}
              onClick={() => setActiveTab('Add Teams')}
            >
              Add New Teams
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-6">
            {activeTab === 'Teams' && (
                <AllTeams organizationId={Id} />
            )}

        {activeTab === 'Members' && (
          <AllMembers organizationId={Id}/>
        )}
        {activeTab === 'Add Teams' && (
          <AddTeam teamName={teamName} setTeamName={setTeamName} organizationId={Id} />
        )}
      </div>
    </div>
  );
}

export default OrganizationProfile;
