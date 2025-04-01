import axios from 'axios';
import React, { useEffect, useState } from 'react';

const Home = () => {
  const [adminTotal, setAdminTotal] = useState(0);
  const [employeeTotal, setEmployeeTotal] = useState(0);
  const [salaryTotal, setSalaryTotal] = useState(0);
  const [admins, setAdmins] = useState([]);
  const [categories, setCategories] = useState([]);
  const [editingAdmin, setEditingAdmin] = useState(null);
  const [showFullTable, setShowFullTable] = useState(false);

  useEffect(() => {
    fetchAdminCount();
    fetchEmployeeCount();
    fetchSalaryCount();
    fetchAdminRecords();
    fetchCategories();
  }, []);

  const fetchAdminRecords = () => {
    axios.get('http://localhost:3000/auth/admin_records')
      .then(result => {
        if (result.data.Status) {
          setAdmins(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const fetchCategories = async () => {
    try {
      const response = await axios.get('http://localhost:3000/auth/category');
      if (response.data.Status) {
        setCategories(response.data.Result);
      } else {
        alert("Error: " + response.data.Error);
      }
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  const fetchAdminCount = () => {
    axios.get('http://localhost:3000/auth/admin_count')
      .then(result => {
        if (result.data.Status) {
          setAdminTotal(result.data.Result[0].admin);
        }
      });
  };

  const fetchEmployeeCount = () => {
    axios.get('http://localhost:3000/auth/employee_count')
      .then(result => {
        if (result.data.Status) {
          setEmployeeTotal(result.data.Result[0].employee);
        }
      });
  };

  const fetchSalaryCount = () => {
    axios.get('http://localhost:3000/auth/salary_count')
      .then(result => {
        if (result.data.Status) {
          setSalaryTotal(result.data.Result[0].salaryOFEmp);
        } else {
          alert(result.data.Error);
        }
      });
  };

  const handleEdit = (admin) => {
    setEditingAdmin({
      ...admin,
      category_id: admin.category_id || '',
      address: admin.address || '',
      salary: admin.salary || '',
      image: null
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditingAdmin({ ...editingAdmin, [name]: value });
  };

  const handleFileChange = (e) => {
    setEditingAdmin({ ...editingAdmin, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('email', editingAdmin.email);
      formData.append('name', editingAdmin.name);
      formData.append("category_id", editingAdmin.category_id);
      formData.append('address', editingAdmin.address);
      formData.append('salary', editingAdmin.salary);
      if (editingAdmin.image) {
        formData.append('image', editingAdmin.image);
      }

      const response = await axios.post('http://localhost:3000/auth/update_admin', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      if (response.data.Status) {
        alert('Admin updated successfully');
        setEditingAdmin(null);
        fetchAdminRecords();
        setShowFullTable(true);
      } else {
        alert(response.data.Error);
      }
    } catch (error) {
      console.error('Update failed:', error);
      alert('Error updating admin');
    }
  };

  return (
    <div className="container">
      {/* Dashboard Summary */}
      <div className="row text-center my-4">
  {[
    { title: "Admins", total: adminTotal, icon: "fas fa-user-shield", gradient: "linear-gradient(135deg, #667eea, #764ba2)" },
    { title: "Employees", total: employeeTotal, icon: "fas fa-users", gradient: "linear-gradient(135deg, #42e695, #3bb2b8)" },
    { title: "Total Salary", total: `₹${salaryTotal}`, icon: "fas fa-rupee-sign", gradient: "linear-gradient(135deg, #ff9a9e, #fecfef)" }
  ].map((item, index) => (
    <div key={index} className="col-md-4">
      <div className="card custom-card shadow-lg"
  style={{
    transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
  }}
  onMouseEnter={(e) => {
    e.currentTarget.style.transform = "scale(1.05)";
    e.currentTarget.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
  }}
  onMouseLeave={(e) => {
    e.currentTarget.style.transform = "scale(1)";
    e.currentTarget.style.boxShadow = "none";
  }}
>
        <div className="card-body d-flex align-items-center justify-content-between" style={{ background: item.gradient, borderRadius: '10px', padding: '20px', color: 'white' }}>
          <div>
            <h5 className="fw-bold">{item.title}</h5>
            <h2 className="fw-bold">{item.total}</h2>
          </div>
          <i className={`${item.icon} fa-3x`}></i>
        </div>
      </div>
    </div>
  ))}
</div>



      {/* Admin Table */}
      <div className="mt-4">
        <h3 className="mb-3">List of Admins</h3>

        <table className="table table-bordered table-hover text-center">
          <thead className="table-dark">
            <tr>
              <th>Email</th>
              {showFullTable && <><th>Name</th><th>Category</th><th>Address</th><th>Salary</th><th>Image</th></>}
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {admins.map((admin) => (
              <tr key={admin.email}
              style={{
                transition: "transform 0.3s ease-in-out, box-shadow 0.3s ease-in-out",
                borderRadius: "10px",
                overflow: "hidden",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "scale(1.05)";
                e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "scale(1)";
                e.currentTarget.style.boxShadow = "none";
              }}
              >
                <td>{admin.email}</td>
                {showFullTable && (
                  <>
                    <td>{admin.name || 'N/A'}</td>
                    <td>{admin.category || 'N/A'}</td>
                    <td>{admin.address || 'N/A'}</td>
                    <td>{admin.salary || 'N/A'}</td>
                    <td>
                      {admin.image ? (
                        <img src={`http://localhost:3000/uploads/${admin.image}`} alt="Admin" width="50" height="50" className="rounded-circle" />
                      ) : 'N/A'}
                    </td>
                  </>
                )}
                <td>
                  <button className="btn btn-info btn-sm me-2" onClick={() => handleEdit(admin)}>Edit</button>
                  <button className="btn btn-danger btn-sm">Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button className="btn btn-primary" onClick={() => setShowFullTable(!showFullTable)}>
          {showFullTable ? "Hide Full Table" : "Show Full Table"}
        </button>
      </div>

      {/* Edit Modal */}
      {editingAdmin && (
        <div className="modal d-block" style={{ background: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Admin</h5>
                <button type="button" className="btn-close" onClick={() => setEditingAdmin(null)}></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  <label>Name:</label>
                  <input type="text" name="name" className="form-control" value={editingAdmin.name} onChange={handleChange} required />

                  <label>Category:</label>
                  <select className="form-control" value={editingAdmin.category_id} onChange={(e) => setEditingAdmin({ ...editingAdmin, category_id: e.target.value })} required>
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>

                  <label>Address:</label>
                  <input type="text" name="address" className="form-control" value={editingAdmin.address} onChange={handleChange} required />

                  <label>Salary:</label>
                  <input type="number" name="salary" className="form-control" value={editingAdmin.salary} onChange={handleChange} required />

                  <label>Image:</label>
                  <input type="file" className="form-control" onChange={handleFileChange} />

                  <button type="submit" className="btn btn-success mt-3">Save Changes</button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
