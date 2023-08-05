import axios from "axios";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function AddEmployees() {
  const token = localStorage.getItem("token");
  const [data, setData] = useState({
    csv: "",
  });
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formdata = new FormData();
    formdata.append("file", data.csv);
    axios
      .post(
        `${process.env.REACT_APP_BACKEND_BASE_URL}admin/addemployees`,
        formdata,
        {
          withCredentials: false,
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data",
          },
        }
      )
      .then((res) => {
        navigate("/employee");
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="d-flex flex-column align-items-center pt-4">
      <h2>Add Employees</h2>
      <form class="row g-3 w-50" onSubmit={handleSubmit}>
        <div class="col-12 mb-3">
          <label class="form-label" for="inputGroupFile01">
            Select CSV File
          </label>
          <input
            type="file"
            class="form-control"
            id="inputGroupFile01"
            onChange={(e) => setData({ ...data, csv: e.target.files[0] })}
          />
        </div>
        <div class="col-12">
          <button type="submit" class="btn btn-primary">
            Create Employees
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddEmployees;
