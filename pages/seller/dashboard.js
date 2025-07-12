
// pages/seller/dashboard.js
import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import SellerAuth from '../../components/SellerAuth';
import ModelUploader from '../../components/ModelUploader';

export default function SellerDashboard() {
  const [session, setSession] = useState(null);
  const [inventory, setInventory] = useState([]);

  const fetchInventory = async () => {
    const { data } = await supabase
      .from('furniture')
      .select('*')
      .eq('seller_id', session.user.id);
    setInventory(data);
  };

  return (
    <div className="seller-container">
      {!session ? (
        <SellerAuth setSession={setSession} />
      ) : (
        <>
          <h1>Seller Dashboard</h1>
          <ModelUploader 
            sellerId={session.user.id} 
            onUpload={fetchInventory}
          />
          
          <div className="inventory-grid">
            {inventory.map(item => (
              <div key={item.id} className="inventory-item">
                <img src={item.thumbnail_url} alt={item.name} />
                <h3>{item.name}</h3>
                <p>Views: {item.view_count || 0}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}