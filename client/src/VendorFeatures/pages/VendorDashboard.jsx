import React, { useState, useEffect } from 'react';
import { IndianRupee, PackageCheck, Star, User, X } from 'lucide-react';
import axios from 'axios';
import Loader from '../../Components/Loader';

function VendorDashboard() {
  const [showVendorDetailsPopup, setShowVendorDetailsPopup] = useState(false);
  const [vendor, setVendor] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const vendorToken = localStorage.getItem('vendorToken');

  const handleVendorDetails = () => setShowVendorDetailsPopup(prev => !prev);

  {/* Vendor Information */}
  useEffect(() => {
    try {
      const storedVendor = localStorage.getItem('vendorInfo');
      if (storedVendor) {
        setVendor(JSON.parse(storedVendor));
      }
    } catch (error) {
      console.error('Failed to parse vendor info:', error);
    }
  }, []);


{/* Vendor Dashboard Cards */}
  const [historyOrders, setHistoryOrders] = useState([]);
  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('https://localbazaar.onrender.com/vendor/order/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendorToken')}`,
        },
      });
      if (response.status === 200) {
        setHistoryOrders(response.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrderHistory();
  }, []);
    
  const [averageRating, setAverageRating] = useState(0);
  useEffect(() => {
    const fetchRatings = async () => {
      if (!vendor?.id) return;
      try {
        const res = await axios.get(`https://localbazaar.onrender.com/vendor/get/review/${vendor.id}`);
        const reviews = res.data || [];
        const avgRating = reviews.length > 0 
          ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length 
          : 0;
        setAverageRating(avgRating);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchRatings();
  }, [vendor?.id]);
  

  {/* Vendor's Orders */}
  useEffect(() => {
    const fetchVendorOrders = async () => {
      try {
        const res = await axios.get('https://localbazaar.onrender.com/vendor/vendor-orders', {
          headers: {
            Authorization: `Bearer ${vendorToken}`,
          },
        });
        setOrders(res.data);
      } catch (error) {
        console.error('Error fetching vendor orders', error);
      } finally {
        setLoading(false);
      }
    };

    fetchVendorOrders();
  }, [vendorToken]);

  const handleStatusUpdate = async (orderId, newStatus) => {

    try {
      await axios.patch('https://localbazaar.onrender.com/user/order/update-status', { orderId, newStatus });
      setLoading(true);
      const res = await axios.get('https://localbazaar.onrender.com/vendor/vendor-orders', {
        headers: { Authorization: `Bearer ${vendorToken}` },
      });
      setOrders(res.data);
    } catch (error) {
      console.error('Error updating order status', error);
    } finally {
      setLoading(false);
    }
  };

  const statuses = [
    { label: 'Accept', status: 'Accepted', color: 'bg-blue-600' },
    { label: 'Preparing', status: 'Preparing', color: 'bg-yellow-500' },
    { label: 'Ready', status: 'Ready for Pickup', color: 'bg-green-600' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Vendor Dashboard</h1>
        <div className="relative">
          <button onClick={handleVendorDetails} className="flex items-center space-x-3 hover:bg-gray-300 bg-gray-100 px-3 py-2 rounded-full">
            <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center">
              {vendor?.businessLogo ? (
                <img src={vendor.businessLogo} alt="Vendor Logo" className="w-full h-full object-cover" />
              ) : (
                <User className="text-gray-500" />
              )}
            </div>
            <span className="font-medium text-gray-700">{vendor?.businessName || 'Vendor'}</span>
          </button>

          {showVendorDetailsPopup && (
            <div className="absolute right-0 mt-2 w-96 bg-white rounded-2xl shadow-2xl border p-6 z-50 animate-fade-in">
              <div className="flex justify-between items-center mb-4">
                <img src={vendor?.businessLogo || '/fallback.png'} alt="Vendor" className="w-16 h-16 object-cover rounded-xl" />
                <button onClick={handleVendorDetails}>
                  <X className="text-gray-500 hover:text-red-500" />
                </button>
              </div>
              <div className="space-y-2 text-gray-700 text-sm">
                <p><strong>Email:</strong> {vendor?.businessEmail || 'N/A'}</p>
                <p><strong>Phone:</strong> {vendor?.phone || 'N/A'}</p>
                <p><strong>Address:</strong> {vendor?.location?.address || 'N/A'}</p>
                <p><strong>City:</strong> {vendor?.location?.city || 'N/A'}</p>
                <p><strong>State:</strong> {vendor?.location?.state || 'N/A'}</p>
                <p><strong>Category:</strong> {vendor?.category || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      <main className="p-6">
                {/* Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
                  {/* Total Orders */}
                  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                      <PackageCheck className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500">Total Orders</p>
                      <h2 className="text-xl font-bold text-gray-800">{historyOrders.length}</h2>
                    </div>
                  </div>

                  {/* Total Revenue */}
                  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="p-3 rounded-full bg-green-100 text-green-600">
                      <IndianRupee className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500">Total Revenue</p>
                      <h2 className="text-xl font-bold text-green-600">
                        ₹{historyOrders.reduce((sum, order) => sum + order.amount, 0)}
                      </h2>
                    </div>
                  </div>

                  {/* Ratings */}
                  <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4">
                    <div className="p-3 rounded-full bg-yellow-100 text-yellow-500">
                      <Star className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-gray-500">Ratings</p>
                      <h2 className="text-xl font-bold text-yellow-500">{averageRating.toFixed(1)}</h2>
                    </div>
                  </div>
                </div>

        {loading ? (
               <Loader/>
        ) : orders.length === 0 ? (
          <div className="text-center text-gray-500 text-lg mt-10">
            No orders yet. 🚀
          </div>
        ) : (

        <div className="space-y-6">
          <h2 className="text-2xl font-semibold mb-6 text-gray-800">Orders</h2>
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 space-y-4">
                <p className="font-semibold text-gray-800 mb-2">👤 Customer: {order.username}</p>
                <p className="text-gray-700">
                  <strong>Items:</strong> {order.items.map(item => `${item.productName} x ${item.quantity}`).join(', ')}
                </p>

                <p className="text-gray-700"><strong>Total:</strong> ₹{order.amount}</p>
                <p className="text-gray-700"><strong>Status:</strong> {order.orderStatus}</p>

                <div className="flex flex-wrap gap-2 mt-4">
                  {statuses.map(({ label, status, color }) => (
                    <button
                      key={status}
                      onClick={() => handleStatusUpdate(order._id, status)}
                      className={`${color} text-white font-semibold rounded-md px-4 py-2`}
                    >
                      {label}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

export default VendorDashboard;
