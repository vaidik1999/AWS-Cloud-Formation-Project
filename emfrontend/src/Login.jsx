import React, { useState } from "react";
import "./App.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";

// const Login = () => {

//   const [values, setValues] = useState({
//     email: '',
//     password: ''
//   });
//   const navigate = useNavigate();
//   axios.defaults.withCredentials = true;
//   const [error, setError] = useState('');

//   const handleSubmit = async (event) => {
//     event.preventDefault();
//     navigate('/dashboard')
//   };

const Login = () => {
  const [values, setValues] = useState({
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();

    try {
      // Make the API call to your backend login endpoint
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}admin/login`,
        {
          email: values.email,
          password: values.password,
        }
      );

      if (response.data.success) {
        // Save the token and user information in local storage or cookies

        console.log(response.data);
        localStorage.setItem("token", response.data.data.token);
        // localStorage.setItem("email", response.data.email);
        // localStorage.setItem("name", response.data.name);
        localStorage.setItem("role", response.data.data.role);

        // Navigate to the dashboard or any other authorized page
        navigate("/dashboard");
      } else {
        setError(response.data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again later.");
    }
  };

  return (
    <div className="container mt-5">
      <div className="row justify-content-center">
        <div className="col-sm-6">
          <div className="card">
            <div className="card-body">
              <h2 className="card-title text-center">Admin Login</h2>
              <form onSubmit={handleSubmit}>
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
                <button type="submit" className="btn btn-primary w-100">
                  Log in
                </button>
                {error && <div className="text-danger mt-3">{error}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
