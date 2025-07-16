// import { useState } from 'react';
// import { useRouter } from 'next/router';
// import { FcGoogle } from 'react-icons/fc'; // npm install react-icons

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const [showPassword, setShowPassword] = useState(false);
//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();

//     localStorage.setItem(
//       'fake-auth',
//       JSON.stringify({ email, role })
//     );

//     if (role === 'seller') {
//       router.push('/dashboard');
//     } else {
//       router.push('/');
//     }
//   };

//   const handleGoogleSignIn = () => {
//     // Allow everyone to sign in – no real auth
//     localStorage.setItem('fake-auth', JSON.stringify({ email: 'google-user@example.com', role: 'user' }));
//     router.push('/');
//   };

//   return (
//     <div className="min-h-screen relative font-sans">
//       {/* Background */}
//       <div 
//         className="absolute inset-0 bg-cover bg-center"
//         style={{
//           backgroundImage: `url('https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg')`,
//           filter: 'blur(3px)'
//         }}
//       ></div>
//       <div className="absolute inset-0 bg-black bg-opacity-30"></div>

//       {/* Content */}
//       <div className="relative z-10 min-h-screen flex items-center justify-center p-6">
//         <div className="w-full max-w-md bg-white bg-opacity-90 rounded-2xl shadow-xl p-8 backdrop-blur-md">
          
//           {/* Logo */}
//           <div className="text-center mb-8">
//             <h1 className="text-4xl font-extrabold text-gray-900 tracking-wide">
//               <span className="text-blue-600">AR</span>Cart
//             </h1>
//             <p className="text-gray-600 text-sm mt-2">"See it. Feel it. Place it — before you buy it."</p>
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleLogin} className="space-y-5">
//             {/* Role */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Login As</label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full border px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 <option value="user">Customer</option>
//                 <option value="seller">Seller</option>
//               </select>
//             </div>

//             {/* Email */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 className="w-full border px-4 py-2 rounded bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//                 placeholder="you@example.com"
//               />
//             </div>

//             {/* Password */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <div className="relative">
//                 <input
//                   type={showPassword ? 'text' : 'password'}
//                   className="w-full border px-4 py-2 rounded bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                   placeholder="Enter password"
//                 />
//                 <button
//                   type="button"
//                   onClick={() => setShowPassword(!showPassword)}
//                   className="absolute right-3 top-2 text-gray-500 text-sm"
//                 >
//                   {showPassword ? 'Hide' : 'Show'}
//                 </button>
//               </div>
//             </div>

//             {/* Submit Button */}
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 rounded-lg font-semibold hover:bg-gray-800 transition"
//             >
//               Log In
//             </button>
//           </form>

//           {/* Divider */}
//           <div className="flex items-center my-4">
//             <div className="flex-grow h-px bg-gray-300" />
//             <span className="mx-3 text-gray-500 text-sm">OR</span>
//             <div className="flex-grow h-px bg-gray-300" />
//           </div>

//           {/* Google Sign In */}
//           <button
//             onClick={handleGoogleSignIn}
//             className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
//           >
//             <FcGoogle size={20} />
//             Sign in with Google
//           </button>

//         </div>
//       </div>
//     </div>
//   );
// }
// import { useState } from 'react';
// import { useRouter } from 'next/router';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();
    
//     // Save fake session to localStorage
//     localStorage.setItem(
//       'fake-auth',
//       JSON.stringify({ email, role })
//     );

//     // Redirect based on role
//     if (role === 'seller') {
//       router.push('/dashboard');
//     } else {
//       router.push('/');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4 font-sans">
//       <div className="w-full max-w-md">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <h1 className="text-3xl font-bold text-gray-900">ARCart</h1>
//           <h2 className="text-xl font-semibold text-gray-600 mt-2">Login to Your Account</h2>
//         </div>

//         {/* Login Form */}
//         <div className="bg-white p-8 rounded-lg shadow-md">
//           {/* Role Selection */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <strong>Select Role</strong>
//             </label>
//             <select
//               value={role}
//               onChange={(e) => setRole(e.target.value)}
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//             >
//               <option value="user">Login as User</option>
//               <option value="seller">Login as Seller</option>
//             </select>
//           </div>

//           {/* Email Field */}
//           <div className="mb-4">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <strong>Email Address</strong>
//             </label>
//             <input
//               type="email"
//               placeholder="Enter your email"
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={email}
//               onChange={(e) => setEmail(e.target.value)}
//               required
//             />
//           </div>

//           {/* Password Field */}
//           <div className="mb-6">
//             <label className="block text-sm font-medium text-gray-700 mb-2">
//               <strong>Password</strong>
//             </label>
//             <input
//               type="password"
//               placeholder="Enter your password"
//               className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//               required
//             />
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             onClick={handleLogin}
//             className="w-full bg-blue-600 text-white py-3 rounded-md font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
//           >
//             Login (No Auth)
//           </button>

//           {/* Footer Links */}
//           <div className="mt-4 text-center text-sm text-gray-600">
//             <a href="#" className="text-blue-600 hover:text-blue-800">
//               Forgot Password?
//             </a>
//             <span className="mx-2">•</span>
//             <a href="#" className="text-blue-600 hover:text-blue-800">
//               Don't have an account? Sign Up
//             </a>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

// import { useState } from 'react';
// import { useRouter } from 'next/router';

// export default function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [role, setRole] = useState('user');
//   const router = useRouter();

//   const handleLogin = (e) => {
//     e.preventDefault();
    
//     // Save fake session to localStorage
//     localStorage.setItem(
//       'fake-auth',
//       JSON.stringify({ email, role })
//     );

//     // Redirect based on role
//     if (role === 'seller') {
//       router.push('/dashboard');
//     } else {
//       router.push('/');
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 flex">
//       {/* Left side - Login Form */}
//       <div className="w-1/2 flex items-center justify-center p-8">
//         <div className="w-full max-w-md">
//           {/* Close button */}
//           <div className="flex justify-end mb-6">
//             <button className="text-gray-400 hover:text-gray-600">
//               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//             </button>
//           </div>

//           {/* Header */}
//           <div className="mb-8">
//             <h1 className="text-3xl font-bold text-gray-900 mb-2">Log In To Your Account</h1>
//             <p className="text-gray-600">Check your order status, update your billing info, and review past purchases.</p>
//           </div>

//           {/* Login Form */}
//           <form onSubmit={handleLogin} className="space-y-6">
//             {/* Role Selection */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Role Selection
//               </label>
//               <select
//                 value={role}
//                 onChange={(e) => setRole(e.target.value)}
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
//               >
//                 <option value="user">Login as User</option>
//                 <option value="seller">Login as Seller</option>
//               </select>
//             </div>

//             {/* Email Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Email *
//               </label>
//               <input
//                 type="email"
//                 placeholder="Yourname@gmail.com"
//                 className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 required
//               />
//             </div>

//             {/* Password Field */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-2">
//                 Password *
//               </label>
//               <div className="relative">
//                 <input
//                   type="password"
//                   placeholder="Yourname@gmail.com"
//                   className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50 pr-10"
//                   value={password}
//                   onChange={(e) => setPassword(e.target.value)}
//                   required
//                 />
//                 <button
//                   type="button"
//                   className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
//                 >
//                   <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L8.46 8.46m1.42 1.42l-1.42-1.42M15.121 14.121L16.54 15.54m-1.42-1.42l1.42 1.42" />
//                   </svg>
//                 </button>
//               </div>
//             </div>

//             {/* Forgot Password Link */}
//             <div className="text-left">
//               <a href="#" className="text-sm text-gray-600 hover:text-gray-800 underline">
//                 Forgot Password
//               </a>
//             </div>

//             {/* Login Button */}
//             <button
//               type="submit"
//               className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
//             >
//               LOG IN
//             </button>

//             {/* Sign Up Link */}
//             <div className="text-center text-sm text-gray-600">
//               Don't have an account? <a href="#" className="text-black hover:underline">Sign Up</a>
//             </div>
//           </form>
//         </div>
//       </div>

//       {/* Right side - Image */}
//       <div className="w-1/2 bg-teal-800 relative overflow-hidden">
//         <div className="absolute inset-0 flex items-center justify-center">
//           {/* Modern chair and decor illustration */}
//           <div className="relative">
//             {/* Pendant lights */}
//             <div className="absolute -top-20 left-10">
//               <div className="w-16 h-16 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full opacity-80"></div>
//               <div className="w-2 h-8 bg-gray-800 mx-auto"></div>
//             </div>
//             <div className="absolute -top-16 right-10">
//               <div className="w-12 h-12 bg-gradient-to-b from-yellow-400 to-yellow-600 rounded-full opacity-80"></div>
//               <div className="w-2 h-6 bg-gray-800 mx-auto"></div>
//             </div>

//             {/* Chair */}
//             <div className="relative z-10">
//               {/* Chair back */}
//               <div className="w-32 h-40 bg-gradient-to-b from-blue-300 to-blue-400 rounded-t-3xl relative">
//                 {/* Cushion */}
//                 <div className="absolute bottom-0 w-full h-16 bg-gradient-to-b from-blue-400 to-blue-500 rounded-t-lg"></div>
//               </div>
              
//               {/* Chair seat */}
//               <div className="w-36 h-4 bg-gradient-to-b from-blue-400 to-blue-500 rounded-lg -mt-2"></div>
              
//               {/* Chair legs */}
//               <div className="flex justify-between mt-2 px-4">
//                 <div className="w-2 h-16 bg-yellow-600 rounded-full"></div>
//                 <div className="w-2 h-16 bg-yellow-600 rounded-full"></div>
//                 <div className="w-2 h-16 bg-yellow-600 rounded-full"></div>
//                 <div className="w-2 h-16 bg-yellow-600 rounded-full"></div>
//               </div>
//             </div>

//             {/* Side table */}
//             <div className="absolute -left-12 top-20">
//               <div className="w-12 h-2 bg-yellow-600 rounded-full"></div>
//               <div className="w-1 h-16 bg-yellow-600 mx-auto"></div>
//               <div className="w-1 h-16 bg-yellow-600 mx-auto -mt-8 ml-8"></div>
//               <div className="w-1 h-16 bg-yellow-600 mx-auto -mt-16 ml-4"></div>
              
//               {/* Plant pot */}
//               <div className="absolute -top-2 left-2 w-8 h-6 bg-white rounded-lg">
//                 <div className="w-6 h-8 bg-green-500 rounded-full mx-auto -mt-2"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

import { useState } from 'react';
import { useRouter } from 'next/router';
import { FcGoogle } from 'react-icons/fc';


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

  const handleGoogleSignIn = () => {
    // Allow everyone to sign in – no real auth
    localStorage.setItem('fake-auth', JSON.stringify({ email: 'google-user@example.com', role: 'user' }));
    router.push('/');
  };

  return (
    <div className="min-h-screen relative">
      {/* Background Image with Blur */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: `url('https://images.pexels.com/photos/1643383/pexels-photo-1643383.jpeg')`,
          filter: 'blur(3px)',
        }}
      ></div>
      
      {/* Dark Overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-20"></div>

      {/* Login Form Container */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          {/* Close button */}
          {/* <div className="flex justify-end mb-6">
            <button className="text-white hover:text-gray-300 bg-black bg-opacity-20 rounded-full p-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div> */}

          {/* Login Form Card */}
          <div className="bg-white bg-opacity-75 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-bold "  >ARCart</h1>
              <p className="text-gray-600">"See it. Feel it. Place it — before you buy it."</p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {/* Role Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role Selection *
                </label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-white"
                >
                  <option value="user">Login as Customer</option>
                  <option value="seller">Login as Seller</option>
                </select>
              </div>

              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email *
                </label>
                <input
                  type="email"
                  placeholder="yourname@gmail.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 bg-gray-50"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password *</label>
              <div className="relative">
                <input
                  type={password ? 'text' : 'password'}
                  className="w-full border px-4 py-2 rounded bg-gray-50 pr-10 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                />
                <button
                  type="button"
                  onClick={() => setPassword(!password)}
                  className="absolute right-3 top-2 text-gray-500 text-sm"
                >
                  {password ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>


              {/* Google Sign In */}
          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-2 border border-gray-300 py-2 rounded-lg hover:bg-gray-50"
          >
            <FcGoogle size={20} />
            Sign in with Google
          </button>

              {/* Login Button */}
              <button
                type="submit"
                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors"
              >
                LOG IN
              </button>

              {/* Sign Up Link
              <div className="text-center text-sm text-gray-600">
                Don't have an account? <a href="#" className="text-black hover:underline">Sign Up</a>
              </div> */}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}