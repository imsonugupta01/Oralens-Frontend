import React, { useEffect, useState } from 'react';

function AllTeams({ organizationId }) {
  const [teamsData, setTeamsData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTeamsAndMembers = async () => {
      try {
        // Fetch teams for the given organization
        const teamsResponse = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/get/${organizationId}`);
        const membersResponse = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/find`);

        if (!teamsResponse.ok || !membersResponse.ok) {
          console.error('Failed to fetch data');
          return;
        }

        const teams = await teamsResponse.json();
        const members = await membersResponse.json();

        // Merge teams with their corresponding member counts
        const mergedData = teams.map((team) => {
          const memberCount = members.find((member) => member.teamId === team._id)?.memberCount || 0;
          return {
            ...team,
            memberCount,
          };
        });

        setTeamsData(mergedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTeamsAndMembers();
  }, [organizationId]);

  if (loading) {
    return <div className="text-center text-xl font-semibold">Loading...</div>;
  }

  const totalTeams = teamsData.length;
  const totalMembers = teamsData.reduce((acc, team) => acc + team.memberCount, 0);

  return (
    <div className="overflow-x-auto p-6 bg-gray-50 rounded-lg shadow-lg">
      {/* Total number report */}
      <div className="mb-6 flex justify-between items-center bg-gradient-to-r from-blue-500 to-teal-500 text-white p-4 rounded-lg shadow-md">
        <div className="text-xl font-semibold">
          <p>Total Teams: <span className="text-2xl">{totalTeams}</span></p>
        </div>
        <div className="text-xl font-semibold">
          <p>Total Members: <span className="text-2xl">{totalMembers}</span></p>
        </div>
      </div>

      {/* Table */}
      <table className="min-w-full table-auto border-collapse border border-gray-300">
        <thead className="bg-gradient-to-r from-indigo-600 to-blue-500 text-white">
          <tr>
            <th className="px-4 py-3 border border-gray-300 text-center">S.No.</th>
            <th className="px-4 py-3 border border-gray-300 text-center">Team Name</th>
            <th className="px-4 py-3 border border-gray-300 text-center">Number of Members</th>
          </tr>
        </thead>
        <tbody>
          {teamsData.map((team, index) => (
            <tr
              key={team._id}
              className={`hover:bg-blue-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-100'}`}
            >
              <td className="px-4 py-3 border border-gray-300 text-center">{index + 1}</td>
              <td className="px-4 py-3 border border-gray-300 text-center">{team.teamName}</td>
              <td className="px-4 py-3 border border-gray-300 text-center">{team.memberCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default AllTeams;
