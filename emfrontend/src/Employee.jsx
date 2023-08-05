import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Employee() {
  const [data, setData] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_BACKEND_BASE_URL}admin/getemployees`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(response.data.data.employeesData);
        setData(response.data.data.employeesData);
      } catch (err) {
        console.log(err);
      }
    }

    axios
      .get(`${process.env.REACT_APP_BACKEND_BASE_URL}admin/getemployees`, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        const data = response.data.data;
        console.log(data);
        setData(data.employeesData);
      })
      .catch((error) => {
        console.log(error);
      });

    // fetchData();
  }, []);

  return (
    <div className="px-5 py-3">
      <div className="d-flex justify-content-center mt-2">
        <h3>Employee List</h3>
      </div>
      <div className="d-flex gap-2 mt-2">
        <Link to="/create" className="btn btn-success">
          Add Employee
        </Link>
        <Link to="/employeeEdit/:id" className="btn btn-success">
          update Employee
        </Link>
        <Link to="/delete/:id" className="btn btn-success">
          Delete Employee
        </Link>
        <Link to="/addemployees" className="btn btn-success">
          Create Employees in Bulk
        </Link>
      </div>
      <div className="mt-3">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Address</th>
              <th>Salary</th>
            </tr>
          </thead>
          <tbody>
            {data.map((employee, index) => {
              return (
                <tr key={index}>
                  <td>{employee.name}</td>
                  <td>{employee.id}</td>
                  <td>{employee.address}</td>
                  <td>{employee.salary}</td>
                  {/* <td>
                    <Link
                      to={`/employeeEdit/` + employee.id}
                      className="btn btn-primary btn-sm me-2"
                    >
                      edit
                    </Link>
                    <button
                      // onClick={(e) => handleDelete(employee.id)}
                      className="btn btn-sm btn-danger"
                    >
                      delete
                    </button> */}
                  {/* </td> */}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Employee;
