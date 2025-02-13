import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

const API_URL = process.env.REACT_APP_API_URL;
console.log('API URL:', process.env.REACT_APP_API_URL);

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobileNumber: '',
    site: '',
    service: '',
    description: '',
  });
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState(null);

  // Fetch users on component mount
  useEffect(() => {
    fetchUsers();
  }, []);

  // Function to get all users
  const fetchUsers = async () => {
    try {
      const response = await axios.get(API_URL);
      setUsers(response.data);
      setError(null);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users. Please check API.');
    }
  };

  // Function to create a new user
  const createUser = async () => {
    try {
      const response = await axios.post(API_URL, formData);
      setUsers([...users, response.data]);
      resetForm();
      setError(null);
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Error creating user. Please try again.');
    }
  };

  // Function to update an existing user
  const updateUser = async () => {
    try {
      const response = await axios.put(
        `${API_URL}/${editingUser.id}`,
        editingUser
      );
      setUsers(
        users.map((user) => (user.id === editingUser.id ? response.data : user))
      );
      setEditingUser(null);
      setError(null);
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Error updating user. Please try again.');
    }
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setUsers(users.filter((user) => user.id !== id));
      setError(null);
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Error deleting user. Please try again.');
    }
  };

  // Handle input change for create & edit form
  const handleInputChange = (event) => {
    const { name, value } = event.target;
    if (editingUser) {
      setEditingUser({ ...editingUser, [name]: value });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // Start editing a user
  const startEditing = (user) => {
    setEditingUser(user);
  };

  // Reset form fields
  const resetForm = () => {
    setFormData({
      name: '',
      email: '',
      mobileNumber: '',
      site: '',
      service: '',
      description: '',
    });
  };

  return (
    <div className="container mt-4">
      <h1 className="text-center mb-4">User Management System</h1>

      {error && <p className="alert alert-danger">{error}</p>}

      {/* Create / Edit Form */}
      <div className="card p-3">
        <h2>{editingUser ? 'Edit User' : 'Create User'}</h2>
        <div className="row">
          <div className="col-md-6">
            <input
              className="form-control mb-2"
              type="text"
              name="name"
              placeholder="Name"
              value={editingUser ? editingUser.name : formData.name}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              type="email"
              name="email"
              placeholder="Email"
              value={editingUser ? editingUser.email : formData.email}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              type="text"
              name="mobileNumber"
              placeholder="Mobile Number"
              value={
                editingUser ? editingUser.mobileNumber : formData.mobileNumber
              }
              onChange={handleInputChange}
            />
          </div>
          <div className="col-md-6">
            <input
              className="form-control mb-2"
              type="text"
              name="site"
              placeholder="Site"
              value={editingUser ? editingUser.site : formData.site}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              type="text"
              name="service"
              placeholder="Service"
              value={editingUser ? editingUser.service : formData.service}
              onChange={handleInputChange}
            />
            <input
              className="form-control mb-2"
              type="text"
              name="description"
              placeholder="Description"
              value={
                editingUser ? editingUser.description : formData.description
              }
              onChange={handleInputChange}
            />
          </div>
        </div>
        <div>
          {editingUser ? (
            <>
              <button className="btn btn-primary me-2" onClick={updateUser}>
                Update
              </button>
              <button
                className="btn btn-secondary"
                onClick={() => setEditingUser(null)}
              >
                Cancel
              </button>
            </>
          ) : (
            <button className="btn btn-success" onClick={createUser}>
              Create
            </button>
          )}
        </div>
      </div>

      {/* User Table */}
      <h2 className="mt-4">User List</h2>
      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Mobile</th>
            <th>Site</th>
            <th>Service</th>
            <th>Description</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.email}</td>
              <td>{user.mobileNumber}</td>
              <td>{user.site}</td>
              <td>{user.service}</td>
              <td>{user.description}</td>
              <td>
                <button
                  className="btn btn-warning btn-sm me-2"
                  onClick={() => startEditing(user)}
                >
                  Edit
                </button>
                <button
                  className="btn btn-danger btn-sm"
                  onClick={() => deleteUser(user.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
