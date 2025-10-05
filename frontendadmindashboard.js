import React, { useState, useEffect } from 'react';
import API from '../api';

function AdminDashboard() {
  const [dashboard,setDashboard] = useState({});

  useEffect(()=>{
    API.get('/admin/dashboard').then(res=>setDashboard(res.data));
  },[]);

  return (
    <div>
      <h2>Admin Dashboard</h2>
      <p>Total Users: {dashboard.totalUsers}</p>
      <p>Total Stores: {dashboard.totalStores}</p>
      <p>Total Ratings: {dashboard.totalRatings}</p>
    </div>
  );
}

export default AdminDashboard;