import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Profile.css'; // Importing custom CSS

const Profile = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceStatus, setAttendanceStatus] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [attendance, setAttendance] = useState([]);

  // Fetch employees and attendance from the database
  useEffect(() => {
    axios.get('http://localhost:3000/auth/employees')
      .then(response => {
        console.log("Fetched Employees: ", response.data);
        setEmployees(response.data);
      })
      .catch(error => {
        console.error("Error fetching employees:", error);
      });

    axios.get('http://localhost:3000/auth/attendance')
      .then(response => {
        console.log("Fetched Attendance: ", response.data);
        setAttendance(response.data);
      })
      .catch(error => {
        console.error("Error fetching attendance:", error);
      });
  }, []);

  // Handle marking attendance for each employee
  const markAttendance = () => {
    if (!selectedDate) {
      alert("Please select a date for attendance.");
      return;
    }

    const allEmployeesHaveStatus = employees.every((employee) => attendanceStatus[employee.id]);
    if (!allEmployeesHaveStatus) {
      alert("Please mark attendance for all employees.");
      return;
    }

    employees.forEach((employee) => {
      const status = attendanceStatus[employee.id];
      if (status) {
        const newAttendance = {
          employeeId: employee.id,
          date: selectedDate,
          status,
        };

        axios.post('http://localhost:3000/auth/attendance', newAttendance)
          .then(response => {
            alert("Attendance marked successfully!");
          })
          .catch(error => {
            console.error("Error marking attendance:", error);
          });
      }
    });
  };

  // Handle radio button change
  const handleRadioChange = (employeeId, status) => {
    setAttendanceStatus(prevState => ({
      ...prevState,
      [employeeId]: status,
    }));
  };

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4">Employee Attendance</h2>

      {/* Select Date */}
      <div className="form-group mb-4">
        <label htmlFor="attendanceDate" className="form-label">Select Date</label>
        <input
          type="date"
          className="form-control"
          id="attendanceDate"
          value={selectedDate}
          onChange={(e) => setSelectedDate(e.target.value)}
        />
      </div>

      {/* Employee Attendance Table */}
      <div className="mb-4">
        <h4>Mark Attendance for Employees</h4>
        <table className="table table-bordered table-striped">
          <thead className="thead-dark">
            <tr>
              <th>Employee Name</th>
              <th>Present</th>
              <th>Absent</th>
              <th>Leave</th>
            </tr>
          </thead>
          <tbody>
            {employees.length > 0 ? (
              employees.map((employee) => (
                <tr key={employee.id}>
                  <td>{employee.name}</td>
                  <td>
                    <input
                      type="radio"
                      name={`attendance-${employee.id}`}
                      value="Present"
                      onChange={() => handleRadioChange(employee.id, "Present")}
                      checked={attendanceStatus[employee.id] === "Present"}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`attendance-${employee.id}`}
                      value="Absent"
                      onChange={() => handleRadioChange(employee.id, "Absent")}
                      checked={attendanceStatus[employee.id] === "Absent"}
                    />
                  </td>
                  <td>
                    <input
                      type="radio"
                      name={`attendance-${employee.id}`}
                      value="Leave"
                      onChange={() => handleRadioChange(employee.id, "Leave")}
                      checked={attendanceStatus[employee.id] === "Leave"}
                    />
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="4" className="text-center">No employees found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Submit Attendance Button */}
      <div className="d-flex justify-content-center mb-4">
        <button onClick={markAttendance} className="btn btn-success">
          Submit Attendance
        </button>
      </div>

      {/* Attendance History */}
      <div>
        <h4>Attendance History</h4>
        <table className="table table-hover">
          <thead className="thead-light">
            <tr>
              <th>Date</th>
              <th>Employee</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {attendance.length > 0 ? (
              attendance.map((record, index) => {
                const employee = employees.find((emp) => String(emp.id) === String(record.employeeId));
                return (
                  <tr key={index}>
                    <td>{record.date}</td>
                    <td>{employee ? employee.name : 'Unknown Employee'}</td>
                    <td>{record.status}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="3" className="text-center">No attendance records found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Profile;
