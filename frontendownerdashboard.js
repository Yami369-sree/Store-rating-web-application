import React, { useState, useEffect } from 'react';
import API from '../api';

function OwnerDashboard() {
  const [data,setData] = useState({ratings:[], store:{}, averageRating:0});

  useEffect(()=>{
    API.get('/stores/owner').then(res=>setData(res.data));
  },[]);

  return (
    <div>
      <h2>Owner Dashboard</h2>
      <p>Store: {data.store.name}</p>
      <p>Average Rating: {data.averageRating}</p>
      <ul>
        {data.ratings.map(r=>(
          <li key={r.id}>{r.User.name} | {r.rating}</li>
        ))}
      </ul>
    </div>
  );
}

export default OwnerDashboard;