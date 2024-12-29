import React, { useEffect, useState } from 'react';

function AllMembers({ organizationId }) {
  const [teams, setTeams] = useState([]);
  const [members, setMembers] = useState([]);
  const [filteredMembers, setFilteredMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedTeam, setSelectedTeam] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    password: '',  // Added password field
    image: null,
  });

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/get/${organizationId}`);
        if (response.ok) {
          const data = await response.json();
          setTeams(data);
        } else {
          console.error('Failed to fetch teams');
        }
      } catch (error) {
        console.error('Error fetching teams:', error);
      }
    };

    const fetchMembers = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/findAll`);
        if (response.ok) {
          const data = await response.json();
          setMembers(data);
          setFilteredMembers(data);
        } else {
          console.error('Failed to fetch members');
        }
      } catch (error) {
        console.error('Error fetching members:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeams();
    fetchMembers();
  }, [organizationId]);

  const handleTeamChange = (e) => {
    const teamId = e.target.value;
    setSelectedTeam(teamId);
    if (teamId) {
      setFilteredMembers(members.filter((member) => member.teamId === teamId));
    } else {
      setFilteredMembers(members);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewMember((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewMember((prevState) => ({
      ...prevState,
      image: file,
    }));
  };

  const handleAddMember = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewMember({
      name: '',
      email: '',
      password: '',  // Reset password field
      image: null,
    });
  };

  const handleSubmitNewMember = async (e) => {
    e.preventDefault();
  
    if (!selectedTeam) {
      alert("Please select a team.");
      return;
    }
  
    if (!newMember.name || !newMember.email || !newMember.password) {
      alert("Please fill in the name, email, and password fields.");
      return;
    }
  
    const formData = new FormData();
    formData.append("teamId", selectedTeam);
    formData.append("name", newMember.name);
    formData.append("email", newMember.email);
    formData.append("password", newMember.password);  // Add password to formData
  
    if (newMember.image) {
      formData.append("image", newMember.image);
    }
  
    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/add `, {
        method: "POST",
        body: formData,
      });
  
      if (response.ok) {
        const addedMember = await response.json();
  
        // Update the state for members
        setMembers((prevMembers) => [...prevMembers, addedMember]);
  
        // Update filteredMembers if the team matches
        if (selectedTeam === addedMember.teamId) {
          setFilteredMembers((prevFiltered) => [...prevFiltered, addedMember]);
        }
  
        alert("New member added successfully!");
        handleCloseModal();
      } else {
        const errorData = await response.json();
        alert(`Failed to add member: ${errorData.message}`);
      }
    } catch (error) {
      console.error("Error adding member:", error);
      alert("Error adding member");
    }
  };

  if (loading) {
    return <div className="text-center text-xl text-gray-600">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Team Selector */}
      <div className="mb-6">
        <label htmlFor="teamSelect" className="block text-sm font-medium text-gray-700">
          Select a Team
        </label>
        <select
          id="teamSelect"
          value={selectedTeam}
          onChange={handleTeamChange}
          className="w-full p-3 mt-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All Teams</option>
          {teams.map((team) => (
            <option key={team._id} value={team._id}>
              {team.teamName}
            </option>
          ))}
        </select>
      </div>

      {/* Members Table */}
      <div className="mt-6">
        {filteredMembers.length > 0 ? (
          <table className="w-full mt-4 border-collapse">
            <thead>
              <tr className="bg-indigo-600 text-white">
                <th className="p-4 text-left text-center">Image</th>
                <th className="p-4 text-left text-center">Name</th>
                <th className="p-4 text-left text-center">Email</th>
              </tr>
            </thead>
            <tbody>
              {filteredMembers.map((member) => (
                <tr
                  key={member._id}
                  className={`border-b ${member.imageUrl ? 'bg-green-50' : 'bg-red-50'}`}
                >
                  <td className="p-4 text-center">
                    <img
                      src={member.imageUrl || 'default-avatar.jpg'}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                  </td>
                  <td className="p-4 font-medium text-center text-gray-700">{member.name}</td>
                  <td className="p-4 text-gray-600 text-center">{member.email}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p className="mt-4 text-gray-600">No members found for the selected team.</p>
        )}
      </div>

      {/* Add New Member Button */}
      <div className="mt-6">
        <button
          onClick={handleAddMember}
          className="w-full bg-blue-600 text-white py-3 rounded-md shadow-lg hover:bg-blue-700 transition duration-300"
        >
          Add New Member
        </button>
      </div>

      {/* Modal for Adding Member */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-96">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Member</h2>

            <form onSubmit={handleSubmitNewMember} className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Member Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={newMember.name}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter member's name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Member Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={newMember.email}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter member's email"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Member Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={newMember.password}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                  placeholder="Enter member's password"
                />
              </div>

              <div>
                <label htmlFor="image" className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <input
                  type="file"
                  id="image"
                  name="image"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full p-3 border border-gray-300 rounded-md mt-2"
                />
              </div>

              <div className="flex justify-between items-center mt-6">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-md"
                >
                  Add Member
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default AllMembers;
