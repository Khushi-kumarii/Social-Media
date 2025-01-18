import React, { useEffect, useState } from 'react';  // For React hooks
import { useNavigate } from 'react-router-dom';   // For navigation
import axios from 'axios';  // For making HTTP requests
import '../styles.css';  // styling

const AdminDashboard = () => {
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

  const handleGoBack = () => {
    navigate('/'); //UserForm
  };

  return (
    <div className="admin-dashboard">
      <h2>Admin Dashboard</h2>
      <table className="user-table">
        <thead>
          <tr>
            <th>Serial No.</th>
            <th>Name</th>
            <th>Social Media Handle</th>
            <th>Images</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={index}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.socialMediaHandle}</td>
              <td>
                <div className="thumbnails">
                {user.images.map((img, idx) => (
                  <img
                    key={img}  
                    src={`http://localhost:5000/uploads/${img}`}
                    alt={`Thumbnail ${idx + 1}`}
                    className="thumbnail"
                  />
                ))}
               </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <button className="go-back-btn" onClick={handleGoBack}>
        Go Back to User Form
      </button>
    </div>
  );
};
export default AdminDashboard;
