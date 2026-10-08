import { useState, useEffect } from "react";
import Navbar from "../Components/Navbar";

function Users() {
  const [users, setUsers] = useState([]);

  const [name, setName] = useState("");
  const [membershipId, setMembershipId] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");

  const [editingId, setEditingId] = useState(null);

  // Check when Local Storage has finished loading
  const [dataLoaded, setDataLoaded] = useState(false);

  // Load users from Local Storage
  useEffect(() => {
    const savedUsers = localStorage.getItem("users");

    if (savedUsers) {
      setUsers(JSON.parse(savedUsers));
    }

    setDataLoaded(true);
  }, []);

  // Save users to Local Storage
  // Only save after the existing data has loaded
  useEffect(() => {
    if (dataLoaded) {
      localStorage.setItem("users", JSON.stringify(users));
    }
  }, [users, dataLoaded]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !membershipId || !password || !role) {
      alert("Please fill in all fields.");
      return;
    }

    if (editingId !== null) {
      // Update existing user
      setUsers(
        users.map((user) =>
          user.id === editingId
            ? {
                ...user,
                name,
                membershipId,
                password,
                role,
              }
            : user
        )
      );

      setEditingId(null);
    } else {
      // Add new user
      const newUser = {
        id: Date.now(),
        name,
        membershipId,
        password,
        role,
      };

      setUsers([...users, newUser]);
    }

    clearForm();
  };

  const clearForm = () => {
    setName("");
    setMembershipId("");
    setPassword("");
    setRole("");
    setEditingId(null);
  };

  const handleEdit = (user) => {
    setName(user.name);
    setMembershipId(user.membershipId);
    setPassword(user.password || "");
    setRole(user.role);
    setEditingId(user.id);
  };

  const handleDelete = (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this user?"
    );

    if (confirmDelete) {
      setUsers(users.filter((user) => user.id !== id));
    }
  };

  return (
    <div>
      <Navbar />

      <main className="users-page">

        {/* Page Header */}
        <div className="page-header">
          <h1>User Management</h1>
          <p>Manage library members, librarians, and administrators.</p>
        </div>

        {/* User Form */}
        <section className="users-form-section">

          <h2>
            {editingId !== null ? "Update User" : "Add New User"}
          </h2>

          <form onSubmit={handleSubmit} className="user-form">

            <div className="form-group">
              <label>Name</label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter user name"
              />
            </div>

            <div className="form-group">
              <label>Membership ID</label>

              <input
                type="text"
                value={membershipId}
                onChange={(e) => setMembershipId(e.target.value)}
                placeholder="Enter membership ID"
              />
            </div>

            <div className="form-group">
              <label>Password</label>

              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter password"
              />
            </div>

            <div className="form-group">
              <label>Role</label>

              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <option value="">Select role</option>
                <option value="Admin">Admin</option>
                <option value="Librarian">Librarian</option>
                <option value="Member">Member</option>
              </select>
            </div>

            <div className="user-form-buttons">

              <button type="submit" className="primary-button">
                {editingId !== null ? "Update User" : "Add User"}
              </button>

              {editingId !== null && (
                <button
                  type="button"
                  className="secondary-button"
                  onClick={clearForm}
                >
                  Cancel
                </button>
              )}

            </div>

          </form>

        </section>

        {/* Users Table */}
        <section className="users-table-section">

          <h2>Users List</h2>

          {users.length === 0 ? (
            <p>No users registered yet.</p>
          ) : (
            <div className="table-container">

              <table>

                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Membership ID</th>
                    <th>Password</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (
                    <tr key={user.id}>

                      <td>{user.name}</td>

                      <td>{user.membershipId}</td>

                      <td>••••••</td>

                      <td>{user.role}</td>

                      <td>
                        <div className="user-action-buttons">

                          <button
                            className="edit-button"
                            onClick={() => handleEdit(user)}
                          >
                            Update
                          </button>

                          <button
                            className="delete-button"
                            onClick={() => handleDelete(user.id)}
                          >
                            Delete
                          </button>

                        </div>
                      </td>

                    </tr>
                  ))}

                </tbody>

              </table>

            </div>
          )}

        </section>

      </main>
    </div>
  );
}

export default Users;