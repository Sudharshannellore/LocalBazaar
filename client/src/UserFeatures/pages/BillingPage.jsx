import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Minus, Plus, Trash } from 'lucide-react';
import Navbar from '../components/Navbar';
import axios from 'axios';
import Footer from '../components/Footer';

const BillingPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [token, setToken] = useState(null);
  const [userData, setUserData] = useState(null);

  const [cartItems, setCartItems] = useState(state?.cartItems || []);

  const [orderDetails, setOrderDetails] = useState({
    name: '',
    phone: '',
    email: '',
    street: '',
    city: '',
    pincode: '',
    paymentMethod: 'COD',
  });

  console.log(cartItems);
  console.log(userData?.id);
  console.log(orderDetails)

  useEffect(() => {
    const storedToken = localStorage.getItem('userToken');
    setToken(storedToken);
    const data = localStorage.getItem('userInfo');
    const parsedUser = JSON.parse(data);
    setUserData(parsedUser);
  }, []);

  useEffect(() => {
    if (userData) {
      setOrderDetails(prev => ({
        ...prev,
        name: userData.username || '',
        phone: userData.phone || '',
        email: userData.email || '',
      }));
    }
  }, [userData]);

  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const deliveryFee = Math.round(totalAmount * 0.2);
  const taxes = Math.round(totalAmount * 0.3);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setOrderDetails((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuantityChange = (itemId, delta) => {
    const updated = cartItems.map(item =>
      item._id === itemId
        ? { ...item, quantity: item.quantity + delta }
        : item
    ).filter(item => item.quantity > 0);
    setCartItems(updated);
  };

  const handleRemoveItem = (itemId) => {
    setCartItems(cartItems.filter(item => item._id !== itemId));
  };

  const handlePlaceOrder = async () => {
    if (orderDetails.paymentMethod === 'Online') {
      // Step 1: Call backend to create Razorpay order
      const { data } = await axios.post('https://localbazaar.onrender.com/user/create/order/razorpay', {
        amount: totalAmount + deliveryFee + taxes,
      });
  
      // Step 2: Open Razorpay payment window
      const options = {
        key: 'rzp_test_1234567890abcdef', // Replace with env or hardcoded for dev
        amount: data.amount,
        currency: data.currency,
        name: 'FreshBazaar',
        description: 'Order Payment',
        order_id: data.orderId,
        handler: async function (response) {
          // Step 3: On successful payment, place the order
          const payload = {
            userId: userData?.id,
            vendorId: cartItems[0]?.vendor,
            username: orderDetails.name,
            email: orderDetails.email,
            phone: orderDetails.phone,
            items: cartItems.map(item => ({
              productItemId: item._id,
              productName: item.name,
              quantity: item.quantity,
              price: item.price,
            })),
            amount: totalAmount,
            deliveryFee : deliveryFee,
            taxes: taxes,
            totalAmount: totalAmount + deliveryFee + taxes,
            deliveryAddress: {
              street: orderDetails.street,
              city: orderDetails.city,
              pincode: orderDetails.pincode,
            },
            paymentMethod: 'Online',
            isPaid: true,
          };
  
          try {
            await axios.post('https://localbazaar.onrender.com/user/place/order', payload);
            navigate('/order-tracking');
          } catch (err) {
            console.log('Order save failed after payment:', err);
          }
        },
        prefill: {
          name: orderDetails.name,
          email: orderDetails.email,
          contact: orderDetails.phone,
        },
        theme: {
          color: '#2d3748',
        },
      };
  
      const rzp = new window.Razorpay(options);
      rzp.open();
    } else {
      // COD - normal order placement
      const payload = {
        userId: userData?.id,
        vendorId: cartItems[0]?.vendor,
        username: orderDetails.name,
        email: orderDetails.email,
        phone: orderDetails.phone,
        items: cartItems.map(item => ({
          productItemId: item._id,
          productName: item.name,
          quantity: item.quantity,
          price: item.price,
        })),
        amount: totalAmount,
        deliveryFee : deliveryFee,
        taxes: taxes,
        totalAmount: totalAmount + deliveryFee + taxes,
        deliveryAddress: {
          street: orderDetails.street,
          city: orderDetails.city,
          pincode: orderDetails.pincode,
        },
        paymentMethod: 'COD',
        isPaid: false,
      };
  
      try {
        await axios.post('https://localbazaar.onrender.com/user/place/order', payload);
        navigate('/order-tracking');
      } catch (err) {
        console.log(err);
      }
    }
  };
  

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 p-6">
        {/* Multi-step form */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex justify-between gap-2">
            {['Account', 'Address', 'Payment'].map((label, index) => (
              <div key={index} className={`flex-1 text-center py-3 rounded-lg font-medium shadow transition-all duration-300 ${
                step === index + 1 ? 'bg-gray-950 text-white scale-105' : 'bg-gray-200 text-gray-700'
              }`}>
                {index + 1}. {label}
              </div>
            ))}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Account</h2>
              {token && userData ? (
                <>
                  <p className="mb-4 text-green-600">Logged in as: <strong>{userData.username}</strong></p>
                  <p className="text-sm text-gray-500 mb-2">{userData.email}</p>
                  <p className="text-sm text-gray-500 mb-2">{userData.phone}</p>
                  <button onClick={() => setStep(2)} className="w-full bg-gray-950 text-white py-2 rounded hover:bg-gray-900 transition">Continue</button>
                </>
              ) : (
                <button onClick={() => navigate('/login/consumer')} className="bg-red-600 text-white w-full py-2 rounded hover:bg-red-700 transition">Login to Continue</button>
              )}
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Delivery Address</h2>
              {['street', 'city', 'pincode'].map(field => (
                <input
                  key={field}
                  name={field}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={orderDetails[field]}
                  onChange={handleInputChange}
                  className="w-full p-2 mb-3 border border-gray-300 rounded"
                />
              ))}
              <div className="flex justify-between">
                <button onClick={() => setStep(1)} className="text-sm text-blue-600 underline">Back</button>
                <button onClick={() => setStep(3)} className="bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900 transition">Continue</button>
              </div>
            </div>
          )}

          {/* Step 3 */}
          {step === 3 && (
            <div className="bg-white p-6 rounded-xl shadow-lg animate-fadeIn">
              <h2 className="text-2xl font-bold mb-4">Payment Method</h2>
              <select name="paymentMethod" value={orderDetails.paymentMethod} onChange={handleInputChange} className="w-full p-2 mb-4 border border-gray-300 rounded">
                <option value="COD">Cash on Delivery</option>
                <option value="Online">Online Payment</option>
              </select>

              {orderDetails.paymentMethod === 'Online' && (
                <p className="text-sm text-blue-600 mb-4">I already Integrate RazorPay account with dummy Key_ID, Key_SECRET If you want 
                                                   check order tracking please go through on cash on delivery</p>
              )}

              <div className="flex justify-between">
                <button onClick={() => setStep(2)} className="text-sm text-blue-600 underline">Back</button>
                <button onClick={handlePlaceOrder} className="bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900 transition">Place Order</button>
              </div>
            </div>
          )}
        </div>

        {/* Cart Summary */}
        <div className="bg-white p-6 rounded-xl shadow-lg sticky top-4 h-fit animate-fadeIn">
          <h2 className="text-2xl font-bold mb-4">Cart Summary</h2>
          {cartItems.length === 0 ? (
            <p className="text-gray-500">Your cart is empty.</p>
          ) : cartItems.map((item) => (
            <div key={item._id} className="flex justify-between items-center border-b py-3">
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-gray-600">₹{item.price} × {item.quantity}</p>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => handleQuantityChange(item._id, -1)}><Minus size={16} /></button>
                <span>{item.quantity}</span>
                <button onClick={() => handleQuantityChange(item._id, 1)}><Plus size={16} /></button>
                <button onClick={() => handleRemoveItem(item._id)}><Trash size={16} className="text-red-600" /></button>
              </div>
            </div>
          ))}

          <div className="mt-4 text-sm space-y-1">
            <div className="flex justify-between"><span>Items Total</span><span>₹{totalAmount}</span></div>
            <div className="flex justify-between"><span>Delivery Fee</span><span>₹{deliveryFee}</span></div>
            <div className="flex justify-between"><span>Taxes</span><span>₹{taxes}</span></div>
            <div className="border-t pt-2 flex justify-between font-semibold text-lg"><span>Total</span><span>₹{totalAmount + deliveryFee + taxes}</span></div>
          </div>
        </div>
      </div>
      <br />
      <Footer/>
    </div>
  );
};

export default BillingPage;
