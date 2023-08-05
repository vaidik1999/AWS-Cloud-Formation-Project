// import React, { useState } from 'react';
// import './App.css';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

// function Start() {
//       const [values, setValues] = useState({
//         email: "",
//         password: "",
//       });
//       const navigate = useNavigate();
//       axios.defaults.withCredentials = true;
//       const [error, setError] = useState("");

//         const handleSubmit = async (event) => {
//     event.preventDefault();
//     navigate('/login')
//         };

import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Start() {
  const [values, setValues] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "",
  });

  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !values.name ||
      !values.email ||
      !values.password ||
      !values.confirmPassword ||
      !values.role
    ) {
      console.log(values);
      setError("All fields are required.");
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}admin/register`,
        {
          name: values.name,
          email: values.email,
          password: values.password,
          confirmPassword: values.confirmPassword,
          role: values.role,
        }
      );

      if (response.data.success) {
        navigate("/login");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Registration failed. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Admin Sign Up</h2>
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label htmlFor="name" className="form-label">
                    Name
                  </label>
                  <input
                    type="name"
                    placeholder="Enter Name"
                    name="name"
                    onChange={(e) =>
                      setValues({ ...values, name: e.target.value })
                    }
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label">
                    Email
                  </label>
                  <input
                    type="email"
                    placeholder="Enter Email"
                    name="email"
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    className="form-control"
                    autoComplete="off"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Password"
                    name="password"
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="password" className="form-label">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    placeholder="Enter Confirm Password"
                    name="password"
                    onChange={(e) =>
                      setValues({ ...values, confirmPassword: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <div className="mb-3">
                  <label htmlFor="role" className="form-label">
                    Role
                  </label>
                  <input
                    type="role"
                    placeholder="Enter Confirm role"
                    name="role"
                    onChange={(e) =>
                      setValues({ ...values, role: e.target.value })
                    }
                    className="form-control"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">
                  Sign Up
                </button>
                {error && <div className="text-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Start;
