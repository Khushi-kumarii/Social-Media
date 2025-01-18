import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import '../styles.css';

const UserForm = () => {
  const [name, setName] = useState('');
  const [socialMediaHandle, setSocialMediaHandle] = useState('');
  const [images, setImages] = useState([]);
  const [selectedImages, setSelectedImages] = useState([]);
  const [error, setError] = useState('');
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const { data } = await axios.get('http://localhost:5000/api/users');
        setUsers(data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUsers();
  }, []);

 // In UserForm component, modify how images are handled
const handleImageChange = (e) => {
  const files = Array.from(e.target.files);
  setImages(files); // Store the selected files for uploading
  setSelectedImages(files); // Show the selected images as previews
};

const handleSubmit = async (e) => {
  e.preventDefault();

  // Check if the user name already exists
  const isDuplicate = users.some(user => user.name === name);
  if (isDuplicate) {
    alert("User with this name already exists.");
    return;
  }

  // Image validation
  if (images.length === 0) {
    setError('At least one image is required');
    return;
  }

  const formData = new FormData();
  formData.append('name', name);
  formData.append('socialMediaHandle', socialMediaHandle);

  for (let i = 0; i < images.length; i++) {
    formData.append('images', images[i]);
  }

  try {
    await axios.post('http://localhost:5000/api/users', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    alert('Submission successful!');
    setName('');
    setSocialMediaHandle('');
    setImages([]);  // Clear the images array
    setSelectedImages([]);  // Clear the selected images preview
    setError('');  // Clear any previous errors
  } catch (err) {
    console.error(err);
    alert('Error submitting data');
  }
};

  const handleViewDashboard = () => {
    navigate('/admin-dashboard');
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>User Submission Form</h2>

      {error && <div className="error">{error}</div>}  {/* Show error message */}

      <label htmlFor="name">Name:</label>
      <input
        id="name"
        type="text"
        placeholder="Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      
      <label htmlFor="socialMediaHandle">Social Media Handle:</label>
      <input
        id="socialMediaHandle"
        type="text"
        placeholder="Social Media Handle"
        value={socialMediaHandle}
        onChange={(e) => setSocialMediaHandle(e.target.value)}
        required
      />

      <label htmlFor="images">Select Images:</label>
      <input
        id="images"
        type="file"
        multiple
        onChange={handleImageChange}
        required  // Ensure that the image field is required
      />

      <div className="selected-images-preview">
        {selectedImages.map((file, index) => (
          <img
            key={index}
            src={URL.createObjectURL(file)}
            alt={`Selected ${index}`}
            className="user-image"
          />
        ))}
      </div>

      <button type="submit">Submit</button>

      <button
        type="button"
        className="view-dashboard-btn"
        onClick={handleViewDashboard}
      >
        View Admin Dashboard
      </button>
    </form>
  );
};

export default UserForm;
