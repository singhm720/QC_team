import React, { useState, useEffect } from "react";
import axios from "axios";
import DataTable from "react-data-table-component";
import url from "../../config"; // Import API URL from your config

const UserAdmin = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    Name: "",
    username: "",
    password: "",
    confirmPassword: "",
    user_type: "qcuser",
  });
  const [alert, setAlert] = useState({ message: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [editingUserId, setEditingUserId] = useState(null); // Tracks the user being edited

  const showAlert = (message, type) => {
    setAlert({ message, type });
    setTimeout(() => setAlert({ message: "", type: "" }), 2000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const validatePassword = (password) => {
    const regex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(password);
  };

  const validateEmail = (username) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(username);
  };

  const validateForm = () => {
    const { Name, username, password, confirmPassword } = formData;
    let formErrors = {};
    if (!Name) formErrors.Name = "Name is required";
    if (!username) formErrors.username = "Username is required";
    if (username && !validateEmail(username)) formErrors.username = "Invalid email format";
    if (!password) formErrors.password = "Password is required";
    if (password && !validatePassword(password)) {
      formErrors.password = "Password must be at least 8 characters, containing letters, numbers, and special characters";
    }
    if (password !== confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match";
    }
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const { Name, username, password, user_type } = formData;

    try {
      setIsLoading(true);

      if (editingUserId) {
        // Update user
        await axios.put(`${url}update_user/${editingUserId}`, { Name, username, password, user_type });
        showAlert("User updated successfully", "success");
      } else {
        // Register new user
        await axios.post(`${url}register`, [{ Name, username, password, user_type }]);
        showAlert("User registered successfully", "success");
      }

      fetchUsers();
      resetForm();
    } catch (error) {
      showAlert(error.response?.data?.error || "Failed to save user", "danger");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get(`${url}get_user_data`);
      setUsers(response.data?.users || []);
    } catch (error) {
      showAlert("Failed to fetch users", "danger");
    }
  };

  const handleEdit = (user) => {
    setFormData({
      Name: user.Name,
      username: user.username,
      password: "",
      confirmPassword: "",
      user_type: user.user_type,
    });
    setEditingUserId(user.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${url}delete_user/${id}`);
      showAlert("User deleted successfully", "success");
      fetchUsers();
    } catch (error) {
      showAlert("Failed to delete user", "danger");
    }
  };

  const resetForm = () => {
    setFormData({
      Name: "",
      username: "",
      password: "",
      confirmPassword: "",
      user_type: "qcuser",
    });
    setErrors({});
    setEditingUserId(null);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const columns = [
    {
      name: "Name",
      selector: (row) => row.Name,
      sortable: true,
    },
    {
      name: "Username",
      selector: (row) => row.username,
      sortable: true,
    },
    {
      name: "User Type",
      selector: (row) => row.user_type,
      sortable: true,
    },
    {
      name: "Action",
      cell: (row) => (
        <div>
          <button className="btn btn-sm btn-primary me-2" onClick={() => handleEdit(row)}>
            Edit
          </button>
          <button className="btn btn-sm btn-danger" onClick={() => handleDelete(row.id)}>
            Delete
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="container mt-5">
      {alert.message && (
        <div
          className={`alert alert-${alert.type} mt-3`}
          role="alert"
          style={{ position: "fixed", top: "20px", left: "20px", zIndex: 1050, maxWidth: "300px" }}
        >
          {alert.message}
        </div>
      )}

      <h2>{editingUserId ? "Edit User" : "Register User"}</h2>

      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-4">
            <label htmlFor="Name" className="form-label">
              Name
            </label>
            <input
              type="text"
              className="form-control"
              id="Name"
              name="Name"
              value={formData.Name}
              onChange={handleInputChange}
              required
            />
            {errors.Name && <div className="text-danger">{errors.Name}</div>}
          </div>
          <div className="col-md-4">
            <label htmlFor="username" className="form-label">
              Username
            </label>
            <input
              type="email"
              className="form-control"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleInputChange}
              required
            />
            {errors.username && <div className="text-danger">{errors.username}</div>}
          </div>
          <div className="col-md-4">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <input
              type="password"
              className="form-control"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required={!editingUserId} // Password is not required during editing
            />
            {errors.password && <div className="text-danger">{errors.password}</div>}
          </div>
        </div>
        <div className="row mt-3">
          <div className="col-md-4">
            <label htmlFor="confirmPassword" className="form-label">
              Confirm Password
            </label>
            <input
              type="password"
              className="form-control"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required={!editingUserId}
            />
            {errors.confirmPassword && <div className="text-danger">{errors.confirmPassword}</div>}
          </div>
          <div className="col-md-4">
            <label htmlFor="user_type" className="form-label">
              User Type
            </label>
            <select
              className="form-control"
              id="user_type"
              name="user_type"
              value={formData.user_type}
              onChange={handleInputChange}
            >
              <option value="User">qcuser</option>
              {/* <option value="User">qctech</option> */}
              <option value="Admin">Admin</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary mt-3" disabled={isLoading}>
          {isLoading ? (editingUserId ? "Updating..." : "Registering...") : editingUserId ? "Update" : "Register"}
        </button>
        {editingUserId && (
          <button type="button" className="btn btn-secondary mt-3 ms-2" onClick={resetForm}>
            Cancel
          </button>
        )}
      </form>

      <hr className="my-4" />

      <h3>Current Users</h3>
      <DataTable columns={columns} data={users} pagination responsive highlightOnHover />
    </div>
  );
};

export default UserAdmin;
