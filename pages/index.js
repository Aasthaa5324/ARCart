import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';

export default function Home() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false); // 👈 new state
  const router = useRouter();

  // ✅ Auth check based on fake-auth token
  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('fake-auth'));

    if (!session || session.role !== 'user') {
      router.push('/login');
    } else {
      setCheckedAuth(true); // ✅ only allow page to show if user is valid
    }
  }, []);

  useEffect(() => {
    const fetchModels = async () => {
      try {
        const { data, error } = await supabase
          .from('furniture')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('❌ Error fetching models:', error);
        } else {
          setModels(data || []);
        }
      } catch (err) {
        console.error('🔥 General error fetching models:', err);
      } finally {
        setLoading(false);
      }
    };

    // ✅ only fetch after auth is confirmed
    if (checkedAuth) {
      fetchModels();
    }
  }, [checkedAuth]);

  const handleLogout = () => {
    localStorage.removeItem('fake-auth');
    router.push('/login');
  };

  if (!checkedAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        <p className="text-gray-500">Checking authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <main className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Furniture AR Collection</h1>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      {models.length === 0 ? (
        <p className="text-gray-500 text-center">No models available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {models.map((model) => (
            <div
              key={model.id}
              className="border rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative h-64 bg-gray-100">
                <img
                  src={model.thumbnail_url || '/default-thumbnail.png'}
                  alt={model.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg">{model.name}</h3>
                <Link
                  href={`/view-ar?id=${model.model_id}`}
                  className="mt-3 inline-block w-full text-center bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600"
                >
                  View in AR
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
