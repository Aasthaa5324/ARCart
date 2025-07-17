// import { useEffect, useState } from 'react';
// import { supabase } from '@/lib/supabaseClient';
// import Link from 'next/link';
// import { useRouter } from 'next/router';
// import 'leaflet/dist/leaflet.css';

// export default function Home() {
//   const [models, setModels] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [checkedAuth, setCheckedAuth] = useState(false);
//   const [search, setSearch] = useState('');
//   const [filteredModels, setFilteredModels] = useState([]);
//   const router = useRouter();

//   useEffect(() => {
//     const session = JSON.parse(localStorage.getItem('fake-auth'));
//     if (!session || session.role !== 'user') {
//       router.push('/login');
//     } else {
//       setCheckedAuth(true);
//     }
//   }, []);

//   useEffect(() => {
//     const fetchModels = async () => {
//       try {
//         const { data, error } = await supabase
//           .from('furniture')
//           .select('*')
//           .order('created_at', { ascending: false });
//         if (error) {
//           console.error('❌ Error fetching models:', error);
//         } else {
//           setModels(data || []);
//         }
//       } catch (err) {
//         console.error('🔥 General error fetching models:', err);
//       } finally {
//         setLoading(false);
//       }
//     };
//     if (checkedAuth) {
//       fetchModels();
//     }
//   }, [checkedAuth]);

//   useEffect(() => {
//     if (!search) {
//       setFilteredModels(models);
//     } else {
//       setFilteredModels(
//         models.filter(
//           (model) =>
//             (model.seller_address && model.seller_address.toLowerCase().includes(search.toLowerCase())) ||
//             (model.seller_name && model.seller_name.toLowerCase().includes(search.toLowerCase()))
//         )
//       );
//     }
//   }, [search, models]);

//   const handleLogout = () => {
//     localStorage.removeItem('fake-auth');
//     router.push('/login');
//   };

//   const handleContactClick = (e) => {
//     e.preventDefault();
//     document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
//   };

//   if (!checkedAuth) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
//         <p className="text-gray-600 text-lg">Checking authentication...</p>
//       </div>
//     );
//   }

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
//         <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-green-50 to-green-100">
//       {/* Navigation Header */}
//       <nav className="bg-white/80 backdrop-blur-sm border-b border-green-100 sticky top-0 z-50">
//         <div className="container mx-auto px-6 py-4">
//           <div className="flex justify-between items-center">
//             <div className="text-2xl font-bold text-gray-800">ARCart</div>
//             <div className="hidden md:flex space-x-8 text-gray-600">
//               <a href="#" className="hover:text-green-600 transition-colors">Home</a>
//               <a href="#" className="hover:text-green-600 transition-colors">About us</a>
//               <a href="#" className="hover:text-green-600 transition-colors">Furniture</a>
//               <a href="#" className="hover:text-green-600 transition-colors">Blog</a>
//               <a href="#contact-section" onClick={handleContactClick} className="hover:text-green-600 transition-colors">Contact us</a>
//             </div>
//             <button
//               onClick={handleLogout}
//               className="bg-gray-800 text-white px-6 py-2 rounded-full hover:bg-gray-700 transition-colors"
//             >
//               Logout
//             </button>
//           </div>
//         </div>
//       </nav>

//       {/* Hero Section */}
//       <section className="container mx-auto px-6 py-16">
//         <div className="grid lg:grid-cols-2 gap-12 items-center">
//           <div className="space-y-6">
//             <h1 className="text-5xl lg:text-6xl font-bold text-gray-800 leading-tight">
//               Furniture that
//               <br />
//               everyone
//               <br />
//               <span className="text-green-600">Loves</span>
//             </h1>
//             <p className="text-gray-600 text-lg max-w-md">
//               We have 500+ Review and our customers trust our Furniture and Quality products.
//             </p>
//             <div className="flex space-x-4">
//               {/* Buy Now button removed */}
//               <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-full hover:bg-gray-50 transition-colors">
//                 Explore
//               </button>
//             </div>
//           </div>
//           <div className="relative">
//             <div className="bg-green-200 rounded-3xl p-8 relative overflow-hidden">
//               {/* Main furniture image as background */}
//               <div
//                 className="rounded-2xl h-64 w-full bg-center bg-cover relative overflow-hidden"
//                 style={{
//                   backgroundImage: "url('')"
//                 }}
//               >
//                 {/* Decorative frames on wall */}
//                 <div className="absolute top-8 right-12 w-16 h-12 bg-pink-200 rounded border-4 border-white shadow-lg"></div>
//                 <div className="absolute top-8 right-32 w-12 h-16 bg-orange-500 rounded border-4 border-white shadow-lg"></div>
//                 <div className="absolute top-12 right-24 w-8 h-8 bg-pink-400 rounded border-2 border-white shadow-lg"></div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </section>

//       {/* Search/Filter Section */}
//       <section className="container mx-auto px-6 pb-8">
//         <div className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row items-center gap-4">
//           <input
//             type="text"
//             value={search}
//             onChange={e => setSearch(e.target.value)}
//             placeholder="Search by address or shop name..."
//             className="w-full md:w-1/2 px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500"
//           />
//           <span className="text-gray-500 text-sm">Find furniture near you or by shop address</span>
//         </div>
//       </section>

//       {/* Furniture Section */}
//       <section className="bg-white py-8">
//         <div className="container mx-auto px-6">
//           <div className="text-center mb-8">
//             <h2 className="text-3xl font-bold text-gray-800 mb-4">
//               Find Your Furniture
//             </h2>
//             <p className="text-gray-600 max-w-md mx-auto">
//               Browse and filter furniture by address or shop name.
//             </p>
//           </div>
//           {filteredModels.length === 0 ? (
//             <div className="text-center py-16">
//               <p className="text-gray-500 text-xl">No models available.</p>
//               <p className="text-gray-400 mt-2">Check back later for new furniture collections.</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
//               {filteredModels.map((model) => (
//                 <div
//                   key={model.id}
//                   className="bg-gray-50 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
//                 >
//                   <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
//                     <img
//                       src={model.thumbnail_url || '/default-thumbnail.png'}
//                       alt={model.name}
//                       className="w-full h-full object-cover"
//                     />
//                   </div>
//                   <div className="p-6">
//                     <h3 className="font-semibold text-lg text-gray-800 mb-2">{model.name}</h3>
//                     <p className="text-gray-700 mb-1"><span className="font-semibold">Price:</span> ₹{model.furniture_price}</p>
//                     <p className="text-gray-700 mb-1"><span className="font-semibold">Description:</span> {model.description}</p>
//                     <p className="text-gray-700 mb-1"><span className="font-semibold">Seller:</span> {model.seller_name}</p>
//                     <p className="text-gray-700 mb-3"><span className="font-semibold">Location:</span> {model.seller_address}</p>
//                     <Link
//                       href={`/view-ar?id=${model.model_id}`}
//                       className="mt-3 inline-block w-full text-center bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700"
//                     >
//                       View in AR
//                     </Link>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </div>
//       </section>

//       {/* Footer & Contact Section */}
//       <footer className="bg-gray-800 text-white py-12" id="contact-section">
//         <div className="container mx-auto px-6">
//           <div className="grid md:grid-cols-4 gap-8">
//             <div>
//               <h3 className="text-xl font-bold mb-4">ARCart</h3>
//               <p className="text-gray-400">
//                 Experience furniture in augmented reality before you buy.
//               </p>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Quick Links</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">About</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Categories</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li><a href="#" className="hover:text-white transition-colors">Chairs</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Tables</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Sofas</a></li>
//                 <li><a href="#" className="hover:text-white transition-colors">Decor</a></li>
//               </ul>
//             </div>
//             <div>
//               <h4 className="font-semibold mb-4">Contact</h4>
//               <ul className="space-y-2 text-gray-400">
//                 <li>Email: <a href="mailto:abs@gmail.com" className="hover:text-white transition-colors">abs@gmail.com</a></li>
//                 <li>Phone: <a href="tel:+123456789" className="hover:text-white transition-colors">+123456789</a></li>
//               </ul>
//             </div>
//           </div>
//           <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
//             <p>&copy; 2025 ARCart. All rights reserved.</p>
//           </div>
//         </div>
//       </footer>
//     </div>
//   );
// }

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import Link from 'next/link';
import { useRouter } from 'next/router';
import 'leaflet/dist/leaflet.css';

export default function Home() {
  const [models, setModels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const [search, setSearch] = useState('');
  const [filteredModels, setFilteredModels] = useState([]);
  const router = useRouter();

  useEffect(() => {
    const session = JSON.parse(localStorage.getItem('fake-auth'));
    if (!session || session.role !== 'user') {
      router.push('/login');
    } else {
      setCheckedAuth(true);
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
    if (checkedAuth) {
      fetchModels();
    }
  }, [checkedAuth]);

  useEffect(() => {
    if (!search) {
      setFilteredModels(models);
    } else {
      setFilteredModels(
        models.filter(
          (model) =>
            (model.seller_address && model.seller_address.toLowerCase().includes(search.toLowerCase())) ||
            (model.seller_name && model.seller_name.toLowerCase().includes(search.toLowerCase()))
        )
      );
    }
  }, [search, models]);

  const handleLogout = () => {
    localStorage.removeItem('fake-auth');
    router.push('/login');
  };

  const handleContactClick = (e) => {
    e.preventDefault();
    document.getElementById('contact-section')?.scrollIntoView({ behavior: 'smooth' });
  };

  if (!checkedAuth) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <p className="text-gray-600 text-lg">Checking authentication...</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gradient-to-br from-green-50 to-green-100">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section with Navigation */}
      <section className="relative h-screen overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('https://images.unsplash.com/photo-1586023492125-27b2c045efd7?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2658&q=80')"
          }}
        >
          {/* Dark overlay for better text readability */}
          <div className="absolute inset-0 bg-black/50"></div>
        </div>

        {/* Navigation */}
        <nav className="relative z-50 bg-transparent">
          <div className="container mx-auto px-6 py-6">
            <div className="flex justify-between items-center">
              <div className="text-3xl font-bold text-white">ARCart</div>
              <div className="hidden md:flex space-x-8 text-white/90">
                <a href="#" className="hover:text-white transition-colors">Home</a>
                <a href="#" className="hover:text-white transition-colors">About us</a>
                <a href="#" className="hover:text-white transition-colors">Furniture</a>
                <a href="#" className="hover:text-white transition-colors">Blog</a>
                <a href="#contact-section" onClick={handleContactClick} className="hover:text-white transition-colors">Contact us</a>
              </div>
              <button
                onClick={handleLogout}
                className="bg-white/20 backdrop-blur-sm text-white px-6 py-2 rounded-full hover:bg-white/30 transition-all duration-300 border border-white/20"
              >
                Logout
              </button>
            </div>
          </div>
        </nav>

        {/* Hero Content */}
        <div className="relative z-40 flex items-center justify-center h-full">
          <div className="text-center text-white px-6 max-w-4xl">
            <h1 className="text-5xl md:text-7xl font-light mb-8 leading-tight">
              "See it. Feel it. Place it - before you buy it."
              <br />
              Redefining furniture shopping with augmented reality.
              <br />
      
            </h1>
            
          </div>
        </div>

        {/* Scroll Down Indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 z-40">
          <div className="animate-bounce">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </div>
        </div>
      </section>

      {/* Search/Filter Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-6">
          <div className="bg-gray-50 rounded-xl shadow-lg p-8 flex flex-col md:flex-row items-center gap-6">
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search by address or shop name..."
              className="w-full md:w-1/2 px-6 py-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <span className="text-gray-600 text-sm">Find furniture near you or by shop address</span>
          </div>
        </div>
      </section>

      {/* Furniture Section */}
      <section className="bg-gray-50 py-16">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-800 mb-4">
              Find Your Perfect Furniture
            </h2>
            <p className="text-gray-600 max-w-md mx-auto text-lg">
              Browse and filter furniture by address or shop name using our AR technology.
            </p>
          </div>
          {filteredModels.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-gray-500 text-xl">No models available.</p>
              <p className="text-gray-400 mt-2">Check back later for new furniture collections.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredModels.map((model) => (
                <div
                  key={model.id}
                  className="bg-white rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2"
                >
                  <div className="relative h-64 bg-gradient-to-br from-gray-100 to-gray-200">
                    <img
                      src={model.thumbnail_url || '/default-thumbnail.png'}
                      alt={model.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-6">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">{model.name}</h3>
                    <p className="text-gray-700 mb-1"><span className="font-semibold">Price:</span> ₹{model.furniture_price}</p>
                    <p className="text-gray-700 mb-1"><span className="font-semibold">Description:</span> {model.description}</p>
                    <p className="text-gray-700 mb-1"><span className="font-semibold">Seller:</span> {model.seller_name}</p>
                    <p className="text-gray-700 mb-3"><span className="font-semibold">Location:</span> {model.seller_address}</p>
                    <Link
                      href={`/view-ar?id=${model.model_id}`}
                      className="mt-3 inline-block w-full text-center bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 transition-colors font-medium"
                    >
                      View in AR
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Footer & Contact Section */}
      <footer className="bg-gray-800 text-white py-12" id="contact-section">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">ARCart</h3>
              <p className="text-gray-400">
                Experience furniture in augmented reality before you buy.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Home</a></li>
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Products</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Categories</h4>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition-colors">Chairs</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Tables</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Sofas</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Decor</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-400">
                <li>Email: <a href="mailto:abs@gmail.com" className="hover:text-white transition-colors">abs@gmail.com</a></li>
                <li>Phone: <a href="tel:+123456789" className="hover:text-white transition-colors">+123456789</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
            <p>&copy; 2025 ARCart. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
