import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminList = () => {
  const [admins, setAdmins] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState(null);

  useEffect(() => {
    fetchAdmins();
  }, []);

  const fetchAdmins = async () => {
    try {
      const response = await axios.get("http://localhost:3000/admins");
      setAdmins(response.data);
    } catch (error) {
      console.error("Error fetching admins:", error);
    }
  };

  const handleEditClick = (admin) => {
    setSelectedAdmin(admin);
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:3000/admins/${selectedAdmin.id}`, selectedAdmin);
      setShowEditModal(false);
      fetchAdmins(); // Refresh the admin list
    } catch (error) {
      console.error("Error updating admin:", error);
    }
  };

  const handleDelete = async (adminId) => {
    try {
      // Make DELETE request to the server to delete the admin
      await axios.delete(`http://localhost:3000/admins/${adminId}`);
      
      // Remove the deleted admin from the state to update the UI
      setAdmins(admins.filter(admin => admin.id !== adminId));
    } catch (error) {
      console.error("Error deleting admin:", error);
    }
  };

  return (
    <div className="container">
      <h2>Admin List</h2>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Address</th>
            <th>Image</th>
            <th>Salary</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {admins.map((admin) => (
            <tr key={admin.id}>
              <td>{admin.name}</td>
              <td>{admin.category}</td>
              <td>{admin.address}</td>
              <td><img src={admin.image} alt="Admin" width="50" /></td>
              <td>{admin.salary}</td>
              <td>
                <button className="btn btn-warning" onClick={() => handleEditClick(admin)}>Edit</button>
                <button className="btn btn-danger ms-2" onClick={() => handleDelete(admin.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Edit Admin Modal */}
      {showEditModal && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Admin</h5>
                <button type="button" className="btn-close" onClick={() => setShowEditModal(false)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleUpdate}>
                  <div className="mb-3">
                    <label>Name</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAdmin.name}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, name: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Category</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAdmin.category}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, category: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Address</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAdmin.address}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, address: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Image URL</label>
                    <input
                      type="text"
                      className="form-control"
                      value={selectedAdmin.image}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, image: e.target.value })}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label>Salary</label>
                    <input
                      type="number"
                      className="form-control"
                      value={selectedAdmin.salary}
                      onChange={(e) => setSelectedAdmin({ ...selectedAdmin, salary: e.target.value })}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-success w-100">Update</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminList;
