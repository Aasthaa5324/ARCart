// components/SocialAuth.js
'use client'; // Required for Next.js client components
import { useState } from 'react'; // Add this import
import { FcGoogle } from 'react-icons/fc';
import { FaGithub } from 'react-icons/fa';
import { supabase } from '@/lib/supabaseClient';

export default function SocialAuth() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState('');

  const handleOAuthLogin = async (provider) => {
    setLoading(provider);
    setError('');

    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: `${window.location.origin}/auth/callback`
        }
      });

      if (error) throw error;
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(null);
    }
  };

  return (
    <>
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-gray-300"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-2 bg-white text-gray-500">OR</span>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <button
          onClick={() => handleOAuthLogin('google')}
          disabled={loading === 'google'}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <FcGoogle className="w-5 h-5" />
          {loading === 'google' ? 'Processing...' : 'Continue with Google'}
        </button>

        <button
          onClick={() => handleOAuthLogin('github')}
          disabled={loading === 'github'}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
        >
          <FaGithub className="w-5 h-5" />
          {loading === 'github' ? 'Processing...' : 'Continue with GitHub'}
        </button>
      </div>
    </>
  );
}