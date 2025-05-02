import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Loader from '../../Components/Loader';

function VendorOrderHistory() {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  const fetchOrderHistory = async () => {
    try {
      const response = await axios.get('https://localbazaar.onrender.com/vendor/order/history', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('vendorToken')}`,
        },
      });
      if (response.status === 200) {
        setOrders(response.data);
        setFilteredOrders(sortOrders(response.data, sortOrder));
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const sortOrders = (ordersToSort, sortBy) => {
    return [...ordersToSort].sort((a, b) => {
      const dateA = new Date(a.placedAt);
      const dateB = new Date(b.placedAt);
      return sortBy === 'latest' ? dateB - dateA : dateA - dateB;
    });
  };

  const filterByDate = () => {
    if (!startDate && !endDate) {
      setFilteredOrders(sortOrders(orders, sortOrder));
      return;
    }

    const start = startDate ? new Date(startDate).getTime() : null;
    const end = endDate ? new Date(endDate).getTime() + 86400000 : null;

    const result = orders.filter(order => {
      const orderDate = new Date(order.placedAt).getTime();
      return (!start || orderDate >= start) && (!end || orderDate <= end);
    });

    setFilteredOrders(sortOrders(result, sortOrder));
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    setFilteredOrders(sortOrders(filteredOrders, newSortOrder));
  };

  const closeModal = () => setSelectedOrder(null);

  useEffect(() => {
    fetchOrderHistory();
  }, []);

  return (
    <div className="p-4">
    <h1 className="text-2xl font-bold mb-4 text-gray-800">Order History</h1>
      <div className="mb-4 flex flex-wrap items-center gap-4">
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">From:</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-gray-600">To:</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border rounded px-2 py-1 text-sm"
          />
        </div>
        <button
          onClick={filterByDate}
          className="bg-gray-950 text-white px-4 py-1 rounded hover:bg-gray-900 text-sm"
        >
          Filter
        </button>
        <div className="flex items-center gap-2 ml-auto">
          <label className="text-sm text-gray-600">Sort:</label>
          <select
            className="border rounded px-3 py-1 text-sm"
            value={sortOrder}
            onChange={handleSortChange}
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>

      {loading ? (
        <Loader />
      ) : filteredOrders.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOrders.map((order) => (
            <div
              key={order._id}
              className="bg-white shadow rounded-lg p-4 cursor-pointer hover:shadow-lg transition"
              onClick={() => setSelectedOrder(order)}
            >
              <div className="flex justify-between items-center mb-2">
                <h3 className="text-md font-semibold text-gray-800">{order.username}</h3>
                <span className={`text-xs px-2 py-1 rounded-full ${order.isPaid ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {order.isPaid ? 'Paid' : 'Unpaid'}
                </span>
              </div>
              <p className="text-sm text-gray-600">
                {order.items.slice(0, 2).map(item => `${item.productName} x${item.quantity}`).join(', ')}
                {order.items.length > 2 && '...'}
              </p>
              <div className="mt-2 text-sm flex justify-between">
                <span className="text-gray-700 font-medium">₹{order.totalAmount}</span>
                <span className="text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded">{order.orderStatus}</span>
              </div>
              <div className="text-right text-xs text-gray-400 mt-2">
                {new Date(order.placedAt).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No Orders found.</p>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
            <button
              onClick={closeModal}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-xl"
            >
              &times;
            </button>

            <h2 className="text-lg font-bold text-gray-800 mb-2">{selectedOrder.username}</h2>
            <p className="text-sm text-gray-600 mb-1">📞 {selectedOrder.phone}</p>
            <p className="text-sm text-gray-600 mb-3">✉️ {selectedOrder.email}</p>

            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-700">Address:</h4>
              <p className="text-sm text-gray-600">
                {selectedOrder.deliveryAddress.street}, {selectedOrder.deliveryAddress.city} - {selectedOrder.deliveryAddress.pincode}
              </p>
            </div>

            <div className="mb-3">
              <h4 className="font-semibold text-sm text-gray-700">Items:</h4>
              <ul className="text-sm text-gray-600 space-y-1 max-h-32 overflow-y-auto pr-2">
                {selectedOrder.items.map((item) => (
                  <li key={item._id} className="flex justify-between">
                    <span>{item.productName} x{item.quantity}</span>
                    <span>₹{item.price}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="border-t pt-3 text-sm text-gray-700 space-y-1">
              <div className="flex justify-between"><span>Amount</span><span>₹{selectedOrder.amount}</span></div>
              <div className="flex justify-between"><span>Delivery Fee</span><span>₹{selectedOrder.deliveryFee}</span></div>
              <div className="flex justify-between"><span>Taxes</span><span>₹{selectedOrder.taxes}</span></div>
              <div className="flex justify-between font-semibold"><span>Total</span><span>₹{selectedOrder.totalAmount}</span></div>
              <div className="flex justify-between"><span>Payment</span><span>{selectedOrder.paymentMethod}</span></div>
              <div className="flex justify-between"><span>Status</span><span>{selectedOrder.orderStatus}</span></div>
              <div className="text-right text-xs text-gray-400">
                {new Date(selectedOrder.placedAt).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorOrderHistory;
