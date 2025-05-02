import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import io from 'socket.io-client';
import Loader from '../../Components/Loader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

const socket = io('http://localhost:8000'); //server URL

const steps = [
  'Placed',
  'Accepted',
  'Preparing',
  'Ready for Pickup',
  'Out for Delivery',
  'Delivered',
];

const OrderTracking = () => {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('userToken');

  const fetchOrder = async () => {
    try {
      const response = await axios.get('https://localbazaar.onrender.com/user/latest/order', {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status === 200) {
        setOrder(response.data.order);
      }
    } catch (error) {
      console.error(error);
      setError('Failed to fetch order. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();

    const interval = setInterval(fetchOrder, 5000);

    socket.on('orderStatusUpdated', (data) => {
      if (order && order._id === data.orderId) {
        setOrder((prevOrder) => ({
          ...prevOrder,
          orderStatus: data.newStatus,
        }));
      }
    });

    return () => {
      socket.off('orderStatusUpdated');
      clearInterval(interval);
    };
  }, [order]);

  const getCurrentStep = (status) => {
    const index = steps.indexOf(status);
    return index !== -1 ? index : 0;
  };

  const currentStep = getCurrentStep(order?.orderStatus);

  useEffect(() => {
    if (order?.orderStatus === 'Delivered') {
      const timeout = setTimeout(() => navigate('/'), 3000);
      return () => clearTimeout(timeout);
    }
  }, [order, navigate]);

  const progressPercentage = ((currentStep + 1) / steps.length) * 100;

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">{error}</p>
        <button
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="flex flex-col justify-center items-center h-screen bg-gray-50">
        <p className="text-gray-600 text-lg">No active orders found.</p>
        <button
          className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-indigo-500 hover:to-blue-500 text-white font-semibold rounded-full shadow-md transition-transform transform hover:scale-105"
          onClick={() => navigate('/')}
        >
          Go Home
        </button>
      </div>
    );
  }

  return (
      <div>
        <Navbar/>
        <br />
        <div className="max-w-2xl mx-auto mt-12 p-8 bg-white shadow-2xl rounded-2xl animate-fadeIn">

      <h2 className="text-3xl font-bold text-center text-gray-950 mb-10">Track Your Order</h2>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-4 mb-6">
        <div
          className="bg-gray-950 h-4 rounded-full transition-all duration-500 ease-in-out"
          style={{ width: `${progressPercentage}%` }}
        ></div>
      </div>

      {/* Current Status Text */}
      <div className="text-center mb-10">
        <p className="text-lg font-bold text-gray-950">
          {order.orderStatus}
        </p>
      </div>

      {/* Order Details */}
      <div className="space-y-6 text-gray-700 text-base">
        <div><span className="font-bold">Order ID:</span> {order._id}</div>
        <div><span className="font-bold">Customer:</span> {order.username}</div>
        <div><span className="font-bold">Phone:</span> {order.phone}</div>
        <div><span className="font-bold">Amount:</span> ₹{order.totalAmount}</div>
        <div>
          <span className="font-bold">Payment:</span>
          <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
            order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {order.isPaid ? 'Paid' : 'Pending'}
          </span>
        </div>
        <div>
          <span className="font-bold">Delivery Address:</span><br />
          {order.deliveryAddress?.street}, {order.deliveryAddress?.city} - {order.deliveryAddress?.pincode}
        </div>
        <div>
          <span className="font-bold">Items Ordered:</span>
          <ul className="list-disc list-inside mt-2">
            {order.items.map((item) => (
              <li key={item.productItemId}>
                <span className="text-gray-800 font-medium">{item.productName}</span> — Qty: {item.quantity} — ₹{item.price}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <button
        className="mt-10 w-full py-3 bg-gray-950 hover:bg-gray-900 text-white font-bold rounded-full shadow-md transition-transform transform hover:scale-105"
        onClick={() => navigate('/')}
      >
        Back to Home
      </button>
    </div>
    <br />
    <Footer/>
      </div>
  );
};

export default OrderTracking;
