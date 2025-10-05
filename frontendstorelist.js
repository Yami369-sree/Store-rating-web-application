import React, { useState, useEffect } from 'react';
import API from '../api';

function StoreList() {
  const [stores,setStores]=useState([]);
  const [rating,setRating]=useState({});
  const [search,setSearch]=useState('');

  const fetchStores = async () => {
    const res = await API.get('/stores', { params: { name: search } });
    setStores(res.data);
  };

  useEffect(()=>{ fetchStores(); }, [search]);

  const submitRating = async (storeId, value) => {
    await API.post('/stores/rating', { store_id: storeId, rating: value });
    fetchStores();
  };

  return (
    <div>
      <h2>Stores</h2>
      <input placeholder="Search by name" value={search} onChange={e=>setSearch(e.target.value)} />
      <ul>
        {stores.map(store=>(
          <li key={store.id}>
            <b>{store.name}</b> | {store.address} | Avg Rating: {store.Ratings.length ? store.Ratings[0].rating : '0'}
            <div>
              <input type="number" min="1" max="5" value={rating[store.id]||''} onChange={e=>setRating({...rating,[store.id]:e.target.value})} />
              <button onClick={()=>submitRating(store.id, parseInt(rating[store.id]))}>Submit</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default StoreList;