import React, { useState, useEffect } from 'react';
import { IndianRupee, PackageCheck, Star, User, X } from 'lucide-react';
import axios from 'axios';
import Loader from '../../Components/Loader';

function DeliveryDashboard() {
  const [showDeliveryDetailsPopup, setShowDeliveryDetailsPopup] = useState(false);
  const [delivery, setDelivery] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [acceptingOrderId, setAcceptingOrderId] = useState(null);

  const handleDeliveryDetails = () => setShowDeliveryDetailsPopup(prev => !prev);


  {/* Dashboard Cards */}
    const [historyOrders, setHistoryOrders] = useState([]);
    const fetchOrderHistory = async () => {
      try {
        const response = await axios.get('https://localbazaar.onrender.com/delivery/orders-history', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('deliveryToken')}`,
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

    
  {/* Delivery Agent Data */}
  useEffect(() => {
    try {
      const storedDelivery = localStorage.getItem('deliveryInfo');
      if (storedDelivery) {
        setDelivery(JSON.parse(storedDelivery));
      }
    } catch (error) {
      console.error('Failed to parse delivery info:', error);
    }
  }, []);

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  {/* Delivery Agent Orders */}
  const fetchDeliveryOrders = async () => {
    try {
      const res = await axios.get('https://localbazaar.onrender.com/delivery/delivery-orders', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('deliveryToken')}`,
        },
      });
      setOrders(res.data.orders);
    } catch (error) {
      console.error('Error fetching delivery orders', error);
    } finally {
      setLoading(false);
    }
  };

  {/* Order Status Updated by Delivery Agent */}
  const handleStatusUpdate = async (orderId, newStatus) => {
    try {
      await axios.patch('https://localbazaar.onrender.com/user/order/update-status', { orderId, newStatus });
      fetchDeliveryOrders();
    } catch (error) {
      console.error('Error updating order status', error);
    }
  };

  {/* Delivery Accept & Update Id in Order */}
  const handleUpdateDeliveryId = async (orderId, deliveryId) => {
    try {
      const response = await axios.put(`https://localbazaar.onrender.com/delivery/delivery-id/${orderId}`, { deliveryId });
      if (response.status === 200) {
        fetchDeliveryOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  {/* Delivery Agent Update Cash and Delivery Payment */}
  const handleUpdatePayment = async (orderId, isPaid) => {
    try {
      const response = await axios.put(`https://localbazaar.onrender.com/delivery/payment-status/${orderId}`, { isPaid });
      if (response.status === 200) {
        fetchDeliveryOrders();
      }
    } catch (error) {
      console.log(error);
    }
  };

  
  const handleAcceptOrder = async (orderId) => {
    try {
      setAcceptingOrderId(orderId);
      await handleStatusUpdate(orderId, 'Out for Delivery');
      await handleUpdateDeliveryId(orderId, delivery.id);
    } catch (error) {
      console.error('Error accepting order:', error);
    } finally {
      setAcceptingOrderId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
        <div className="relative">
          <button
            onClick={handleDeliveryDetails}
            className="flex items-center gap-2 p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition"
          >
            <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
              <User className="text-gray-600" />
            </div>
            <span className="hidden sm:inline text-gray-700 font-medium">{delivery?.username || 'Delivery'}</span>
          </button>

          {/* Popup */}
          {showDeliveryDetailsPopup && (
            <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg p-5 border z-50">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
                <button onClick={handleDeliveryDetails}>
                  <X className="w-5 h-5 text-gray-500 hover:text-red-600" />
                </button>
              </div>
              <div className="text-gray-700 text-sm space-y-3">
                <p><strong>Email:</strong> {delivery?.email || 'N/A'}</p>
                <p><strong>Phone:</strong> {delivery?.phone || 'N/A'}</p>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <Loader />
        ) : (
          <>
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
                        ₹{historyOrders.reduce((sum, order) => sum + order.deliveryFee, 0)}
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
                      <h2 className="text-xl font-bold text-yellow-500">4.8</h2>
                    </div>
                  </div>
                </div>
                 
            {orders.length > 0 ? (
              <div className="space-y-6">
                <h2 className="text-xl font-semibold text-gray-800">Orders to Deliver</h2>
                {orders.map(order => (
                  <div key={order._id} className="bg-white rounded-xl shadow hover:shadow-lg transition-all p-6 space-y-4">
                    <div className="space-y-1 text-gray-700 text-sm">
                      <p><strong>👤 Customer: </strong> {order.username}</p>
                      <p className="text-gray-700">
                        <strong>Items:</strong> {order.items.map(item => `${item.productName} x ${item.quantity}`).join(', ')}
                      </p>
                      <p><strong>Total Amount:</strong> ₹{order.totalAmount}</p>
                      <p><strong>Order Status:</strong> {order.orderStatus}</p>
                      <p><strong>Address:</strong> {order.deliveryAddress.street}, {order.deliveryAddress.city}, {order.deliveryAddress.pincode}</p>
                      <div>
                        <span className="font-bold">Payment:</span>
                        <span className={`ml-2 px-3 py-1 rounded-full text-xs ${
                          order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                          {order.isPaid ? 'Paid' : 'Pending'}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-3 pt-3 border-t">
                      <button
                        onClick={() => handleAcceptOrder(order._id)}
                        disabled={acceptingOrderId === order._id}
                        className={`flex items-center gap-2 px-4 py-2 rounded-md text-white font-semibold ${
                          acceptingOrderId === order._id
                            ? 'bg-blue-400 cursor-not-allowed'
                            : 'bg-blue-500 hover:bg-blue-600'
                        }`}
                      >
                          Accept
                      </button>

                      <button
                        className="px-4 py-2 bg-green-500 hover:bg-green-600  text-white font-semibold rounded-md"
                        onClick={() => handleUpdatePayment(order._id, true)}
                      >
                        Paid
                      </button>

                      <button
                        className="px-4 py-2 bg-yellow-400 hover:bg-yellow-500 text-white font-semibold rounded-md"
                        onClick={() => handleStatusUpdate(order._id, 'Delivered')}
                      >
                        Delivered
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center text-gray-500 mt-20">
                <p>No orders yet. 🚀</p>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}

export default DeliveryDashboard;
