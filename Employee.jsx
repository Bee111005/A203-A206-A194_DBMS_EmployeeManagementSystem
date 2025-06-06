import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Employee.css"; // Import the updated CSS file

const Employee = () => {
  const [employee, setEmployee] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get("http://localhost:3000/auth/employee")
      .then((result) => {
        if (result.data.Status) {
          setEmployee(result.data.Result);
        } else {
          alert(result.data.Error);
        }
      })
      .catch((err) => console.log(err));
  }, []);

  const handleDelete = (id) => {
    axios.delete("http://localhost:3000/auth/delete_employee/" + id).then((result) => {
      if (result.data.Status) {
        window.location.reload();
      } else {
        alert(result.data.Error);
      }
    });
  };

  return (
    <div className="employee-container">
      <h3 className="header">Employee List</h3>
      <Link to="/dashboard/add_employee" className="add-btn">
        Add Employee
      </Link>
      <table className="employee-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Image</th>
            <th>Email</th>
            <th>Address</th>
            <th>Salary</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {employee.map((e) => (
            <tr key={e.id}>
              <td>{e.name}</td>
              <td>
                <img src={`http://localhost:3000/Images/` + e.image} className="employee-image" alt="employee" />
              </td>
              <td>{e.email}</td>
              <td>{e.address}</td>
              <td>{e.salary}</td>
              <td className="action-buttons">
                <Link to={`/dashboard/edit_employee/${e.id}`} className="edit-btn">
                  Edit
                </Link>
                <button className="delete-btn" onClick={() => handleDelete(e.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Employee;
