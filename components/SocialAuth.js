// components/SocialAuth.js
'use client'
import { supabase } from '@/lib/supabaseClient'
import { FcGoogle } from 'react-icons/fc'
import { FaGithub } from 'react-icons/fa'

export default function SocialAuth() {
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

      <div className="space-y-4">
        <button
          onClick={() => supabase.auth.signInWithOAuth({
            provider: 'google',
          })}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FcGoogle className="w-5 h-5" />
          Continue with Google
        </button>

        <button
          onClick={() => supabase.auth.signInWithOAuth({
            provider: 'github',
          })}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FaGithub className="w-5 h-5" />
          Continue with GitHub
        </button>
      </div>
    </>
  )
}