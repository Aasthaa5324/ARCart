// components/SellerAuth.js
import { useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export default function SellerAuth({ setSession }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });
    if (data.session) setSession(data.session);
  };

  return (
    <div className="auth-form">
      <input type="email" onChange={(e) => setEmail(e.target.value)} />
      <input type="password" onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Login</button>
    </div>
  );
}