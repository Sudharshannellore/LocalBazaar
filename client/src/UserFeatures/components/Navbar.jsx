import React, { useState, useEffect } from 'react';
import { CircleUserRound, ShoppingBag } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

function Navbar() {
  const [showDropdown, setShowDropdown] = useState(false);
  const [userData, setUserData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('userInfo');
      if (storedUser) {
        setUserData(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Failed to parse user info:', error);
    }
  }, []);

  const user = userData ? {
    name: userData.username,
    email: userData.email,
    phone: userData.phone,
  } : null;

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  
  const handleLogout = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('userInfo');
    window.location.reload(); // Reload to reset state and remove user data
  };

  const closeDropdown = () => setShowDropdown(false);

  return (
    <nav>
      <div className="w-full px-4 sm:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-2 cursor-pointer" onClick={() => navigate('/')}>
            <ShoppingBag className="h-7 w-7 text-gray-950" />
            <span className="text-xl font-bold text-gray-950">Local Bazaar</span>
          </div>

          {/* Right Section */}
          <div className="flex items-center space-x-6">
            {/* Profile Dropdown */}
            <div className="relative">
              <button onClick={toggleDropdown}>
                <CircleUserRound className="h-6 w-6 text-gray-950" />
              </button>
              {showDropdown && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded shadow-lg z-50 p-4">
                  {user ? (
                    <>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-sm text-gray-500 mb-2">{user.email}</p>
                      <p className="text-sm text-gray-500 mb-2">{user.phone}</p>
                      <hr className="my-2" />
                      <button
                        onClick={() => { navigate('/order-tracking'); closeDropdown(); }}
                        className="w-full text-left text-gray-500 hover:text-gray-950"
                      >
                        Track Current Order
                      </button>
                      <br />
                      <button
                        onClick={() => { navigate('/orders-history'); closeDropdown(); }}
                        className="w-full text-left text-gray-500 hover:text-gray-950"
                      >
                        My Orders
                      </button>
                      <button
                        onClick={() => { handleLogout(); closeDropdown(); }}
                        className="w-full text-left text-red-600 hover:text-red-800 mt-2"
                      >
                        Logout
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-gray-600">You are not logged in.</p>
                      <button
                        onClick={() => { navigate('/login/consumer'); closeDropdown(); }}
                        className="mt-2 w-full bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900"
                      >
                        Consumer Login
                      </button>
                      <button
                        onClick={() => { navigate('/login/business'); closeDropdown(); }}
                        className="mt-2 w-full bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900"
                      >
                        Business Login
                      </button>
                      <button
                        onClick={() => { navigate('/login/delivery'); closeDropdown(); }}
                        className="mt-2 w-full bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900"
                      >
                        Delivery Agent Login
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
