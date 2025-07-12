// pages/seller/inventory.js
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function Inventory() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    const { data } = await supabase
      .from('furniture')
      .select(`
        *,
        seller_furniture!inner(seller_id)
      `)
      .eq('seller_furniture.seller_id', user.id);

    setItems(data);
    setLoading(false);
  };

  const deleteItem = async (id) => {
    await supabase.from('furniture').delete().eq('id', id);
    fetchItems(); // Refresh list
  };

  useEffect(() => { fetchItems(); }, []);

  return (
    <div className="inventory-container">
      <h2>Your Models</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="model-grid">
          {items.map(item => (
            <div key={item.id} className="model-card">
              <img src={item.thumbnail_url} alt={item.name} />
              <h3>{item.name}</h3>
              <button 
                onClick={() => deleteItem(item.id)}
                className="delete-button"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}