import React from "react";
import Login from "./Login";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Dashboard from "./Dashboard";
import Employee from "./Employee";
import Profile from "./Profile";
import AddEmployee from "./AddEmployee";
import EditEmployee from "./EditEmployee";
import Start from "./Start";
import DeleteEmployee from "./DeleteEmployee";
import AddEmployees from "./AddEmployees";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/dashboard" element={<Dashboard />}></Route>
        <Route path="/employee" element={<Employee />}></Route>
        <Route path="/profile" element={<Profile />}></Route>
        <Route path="/create" element={<AddEmployee />}></Route>
        <Route path="/addemployees" element={<AddEmployees />}></Route>
        <Route path="/employeeEdit/:id" element={<EditEmployee />}></Route>
        <Route path="/delete/:id" element={<DeleteEmployee />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="" element={<Start />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
