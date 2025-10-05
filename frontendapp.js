import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import StoreList from './pages/StoreList';
import AdminDashboard from './pages/AdminDashboard';
import OwnerDashboard from './pages/OwnerDashboard';

function App() {
  const token = localStorage.getItem('token');
  const role = localStorage.getItem('role');

  return (
    <Routes>
      <Route path="/" element={token ? <Navigate to="/stores" /> : <Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      {token && <Route path="/stores" element={<StoreList />} />}
      {token && role === 'ADMIN' && <Route path="/admin" element={<AdminDashboard />} />}
      {token && role === 'OWNER' && <Route path="/owner" element={<OwnerDashboard />} />}
    </Routes>
  );
}

export default App;