import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

function MemberProfile() {
  const { Id } = useParams();
  const [profile, setProfile] = useState(null);
  const [team, setTeam] = useState(null);
  const [organization, setOrganization] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const fetchTeamAndOrganization = async (Id) => {
    try {
      const teamResponse = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/team/findById/${Id}`);
      if (!teamResponse.ok) throw new Error('Failed to fetch team data.');
      const teamData = await teamResponse.json();
      console.log(teamData)
      setTeam(teamData);

      const orgResponse = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/organization/getById/${teamData.organizationId}`);
      if (!orgResponse.ok) throw new Error('Failed to fetch organization data.');
      const orgData = await orgResponse.json();
      setOrganization(orgData);
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/findById/${Id}`);
        if (!response.ok) throw new Error('Failed to fetch profile data.');
        const data = await response.json();
        setProfile(data);
        setImageUrl(data.imageUrl);

        if (data.teamId) {
          console.log(data.teamId)
          await fetchTeamAndOrganization(data.teamId);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [Id]);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setImageFile(file);
  };
  const navigate=useNavigate()

  const handleImageUpload = async () => {
    if (!imageFile) return;

    const formData = new FormData();
    formData.append('image', imageFile);

    try {
      const response = await fetch(`${process.env.REACT_APP_ROOT_API_URL}/member/upload/${Id}`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        setImageUrl(data.member.imageUrl);
        setIsModalOpen(false);
      } else {
        setError('Failed to upload image.');
      }
    } catch (err) {
      setError('An error occurred while uploading the image.');
    }
  };

  const handleCaptureImage = async () => {
    if (videoRef.current) {
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;
      context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

      canvas.toBlob((blob) => {
        const file = new File([blob], 'captured-image.jpg', { type: 'image/jpeg' });
        setImageFile(file);
        handleImageUpload();
      });

      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'user' } });
      videoRef.current.srcObject = stream;
      setIsCameraActive(true);
    } catch (err) {
      setError('Unable to access camera.');
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach((track) => track.stop());
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    if (!isModalOpen) {
      stopCamera();
    }
  }, [isModalOpen]);

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
    <div className="min-h-screen bg-gray-50">
      <header className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white  p-4 flex justify-between items-center fixed top-0 left-0 right-0 z-10 shadow-lg">
      <h1 className="text-xl font-bold">Explore</h1>
      <button
        className="bg-red-500 px-4 py-2 rounded hover:bg-red-600 transition duration-200"
         onClick={()=>{navigate("/")}}
      >
        Logout
      </button>
    </header>

      <div className="flex justify-center items-center mt-24">
  <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 p-1 rounded-lg shadow-lg w-full max-w-lg">
    <div className="bg-white p-8 rounded-lg">
      <div className="text-center mb-6">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt="Profile"
            className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-purple-500"
          />
        ) : (
          <div className="w-32 h-32 rounded-full bg-gray-200 mx-auto mb-4 flex justify-center items-center border-4 border-dashed border-gray-400">
            <span className="text-xl text-gray-500">No Image</span>
          </div>
        )}
        <h2 className="text-2xl font-bold text-gray-800">{profile?.name}</h2>
        <p className="text-gray-600">{profile?.email}</p>
      </div>

      <div className="text-gray-700 mt-6">
        <h3 className="text-lg font-semibold text-purple-700 mb-2 border-b-2 border-purple-300 pb-1">
          Details:
        </h3>
        <div className="space-y-3">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Team Name:</span>
            <span className="text-gray-600">{team?.teamName || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Organization Name:</span>
            <span className="text-gray-600">{organization?.name || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-semibold text-gray-800">Organization Location:</span>
            <span className="text-gray-600">{organization?.location || 'N/A'}</span>
          </div>
        </div>
      </div>

      {!imageUrl && (
        <div className="mt-6 text-center">
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-green-400 to-blue-500 text-white py-2 px-6 rounded-lg hover:scale-105 transform transition duration-300"
          >
            Upload Profile Image
          </button>
        </div>
      )}
    </div>
  </div>
</div>

{isModalOpen && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
    <div className="bg-white p-6 rounded-lg shadow-lg w-96">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        Upload Profile Image
      </h2>
      <div className="space-y-4">
        <button
          onClick={startCamera}
          className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
        >
          Use Camera
        </button>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="block w-full text-gray-800 border border-gray-300 rounded-lg py-2 px-3"
        />
      </div>
      {isCameraActive && (
        <div className="mt-4">
          <video
            ref={videoRef}
            autoPlay
            className="w-full rounded-lg border border-gray-300"
          />
          <button
            onClick={handleCaptureImage}
            className="w-full mt-2 bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
          >
            Capture Image
          </button>
        </div>
      )}
      <canvas ref={canvasRef} style={{ display: 'none' }} />
      <div className="mt-6 flex justify-end space-x-2">
        <button
          onClick={handleImageUpload}
          className="bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
          disabled={!imageFile}
        >
          Upload Image
        </button>
        <button
          onClick={() => setIsModalOpen(false)}
          className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
        >
          Close
        </button>
      </div>
    </div>
  </div>
)}

    </div>
  );
}

export default MemberProfile;
