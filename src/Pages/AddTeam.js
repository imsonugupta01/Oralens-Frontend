import React from 'react';

function AddTeam({ teamName, setTeamName, organizationId }) {
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!teamName) {
      alert('Please enter a team name');
      return;
    }

    // Make a request to the backend to add the team
    const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ teamName, organizationId }), // Pass both teamName and organizationId
    });

    if (response.ok) {
      alert('Team added successfully!');
      setTeamName(''); // Clear input field after submission
    } else {
      alert('Failed to add team');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <input
          type="text"
          id="teamName"
          value={teamName}
          onChange={(e) => setTeamName(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md mt-2"
          placeholder="Enter team name"
        />
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-2 rounded-md mt-4"
      >
        Add Team
      </button>
    </form>
  );
}

export default AddTeam;
