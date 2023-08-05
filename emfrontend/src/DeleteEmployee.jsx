import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function DeleteEmployee() {
  const [data, setData] = useState({
    email: "",
  });
  const navigate = useNavigate();
  const handleSubmit = (event) => {
    event.preventDefault();
    const token = localStorage.getItem("token");
    console.log(token);
    axios
      .delete(`${process.env.REACT_APP_BACKEND_BASE_URL}admin/deleteemployee`, {
        withCredentials: false,
        headers: {
          Authorization: `Bearer ${token}`,
        },
        data: {
          email: data.email,
        },
      })
      .then((res) => {
        navigate("/employee");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Delete Employee</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12">
          <label for="inputEmail4" class="form-label">
            Email
          </label>
          <input
            type="email"
            class="form-control"
            id="inputEmail4"
            placeholder="Enter Email"
            autoComplete="off"
            onChange={(e) => setData({ ...data, email: e.target.value })}
            value={data.email}
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Delete Employee
          </button>
        </div>
      </form>
    </div>
  );
}

export default DeleteEmployee;
