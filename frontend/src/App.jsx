import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SWRProvider } from './config/swr.js';
import { AuthProvider } from './contexts/AuthContext.jsx';
import Layout from './components/layout/Layout.jsx';
import Login from './components/auth/Login.jsx';
import Register from './components/auth/Register.jsx';
import Dashboard from './components/dashboard/Dashboard.jsx';
import CompanyList from './components/companies/CompanyList.jsx';
import CompanyDetail from './components/companies/CompanyDetail.jsx';
import DepartmentList from './components/departments/DepartmentList.jsx';
import DepartmentDetail from './components/departments/DepartmentDetail.jsx';
import EmployeeList from './components/employees/EmployeeList.jsx';
import EmployeeDetail from './components/employees/EmployeeDetail.jsx';
import EmployeeCreate from './components/employees/EmployeeCreate.jsx';
import EmployeeEdit from './components/employees/EmployeeEdit.jsx';
import './App.css';

function App() {
  return (
    <SWRProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Protected routes */}
              <Route path="/" element={<Layout />}>
                <Route index element={<Dashboard />} />
                <Route path="companies" element={<CompanyList />} />
                <Route path="companies/:id" element={<CompanyDetail />} />
                <Route path="departments" element={<DepartmentList />} />
                <Route path="departments/:id" element={<DepartmentDetail />} />
                <Route path="employees" element={<EmployeeList />} />
                <Route path="employees/create" element={<EmployeeCreate />} />
                <Route path="employees/:id" element={<EmployeeDetail />} />
                <Route path="employees/:id/edit" element={<EmployeeEdit />} />
              </Route>
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </SWRProvider>
  );
}

export default App;
