// // // pages/login.js
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     // ✅ Save fake session to localStorage
//     localStorage.setItem(
//       'fake-auth',
//       JSON.stringify({ email, role })
//     );

//     // ✅ Redirect based on role
//     if (role === 'seller') {
//       router.push('/dashboard');  // Make sure dashboard.js exists
//     } else {
//       router.push('/');           // index.js = homepage
//     }
//   };

//   return (
//     <div className="min-h-screen flex items-center justify-center bg-gray-100">
//       <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
//         <h2 className="text-2xl font-bold text-center mb-6">Demo Login</h2>
//         <form onSubmit={handleLogin} className="space-y-4">
//           <select
//             value={role}
//             onChange={(e) => setRole(e.target.value)}
//             className="w-full p-2 border rounded"
//           >
//             <option value="user">Login as User</option>
//             <option value="seller">Login as Seller</option>
//           </select>
//           <input
//             type="email"
//             placeholder="Any email"
//             className="w-full p-2 border rounded"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             placeholder="Any password"
//             className="w-full p-2 border rounded"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />

         

//           <button
//             type="submit"
//             className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
//           >
//             Login (No Auth)

            
//           </button>
//         </form>
//       </div>
//     </div>
//   );
// }
import { useState } from 'react';
import { useRouter } from 'next/router';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    
    // Save fake session to localStorage
    localStorage.setItem(
      'fake-auth',
      JSON.stringify({ email, role })
    );

    // Redirect based on role
    if (role === 'seller') {
      router.push('/dashboard');
    } else {
      router.push('/');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">ARCart</h1>
          <h2 className="text-xl font-semibold text-gray-600 mt-2">Login to Your Account</h2>
        </div>

        {/* Login Form */}
        <div className="bg-white p-8 rounded-lg shadow-md">
          {/* Role Selection */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <strong>Select Role</strong>
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="user">Login as User</option>
              <option value="seller">Login as Seller</option>
            </select>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <strong>Email Address</strong>
            </label>
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <strong>Password</strong>
            </label>
            <input
              type="password"
              placeholder="Enter your password"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Login Button */}
          <button
            type="submit"
            onClick={handleLogin}
            className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Login (No Auth)
          </button>

          {/* Footer Links */}
          <div className="mt-4 text-center text-sm text-gray-600">
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Forgot Password?
            </a>
            <span className="mx-2">•</span>
            <a href="#" className="text-blue-600 hover:text-blue-800">
              Don't have an account? Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}