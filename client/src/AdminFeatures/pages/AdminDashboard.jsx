import React, { useEffect, useState } from 'react';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { IndianRupee, PackageCheck, X } from 'lucide-react';

function AdminDashboard() {
  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [sortOrder, setSortOrder] = useState('latest');

  useEffect(() => {
    fetchDeliveryOrders();
  }, []);

  const fetchDeliveryOrders = async () => {
    try {
      const res = await axios.get('https://localbazaar.onrender.com/admin/orders');
      setOrders(res.data || []);
    } catch (error) {
      console.error('Error fetching orders', error);
      setOrders([])
    } finally {
      setLoading(false);
    }
  };

  const filteredOrders = orders
    .filter(order => {
      const orderDate = new Date(order.placedAt);
      const from = fromDate ? new Date(fromDate) : null;
      const to = toDate ? new Date(toDate) : null;
      return (!from || orderDate >= from) && (!to || orderDate <= to);
    })
    .sort((a, b) => {
      return sortOrder === 'latest'
        ? new Date(b.placedAt) - new Date(a.placedAt)
        : new Date(a.placedAt) - new Date(b.placedAt);
    });

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-md px-6 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-800">Delivery Dashboard</h1>
      </header>

      {/* Main Content */}
      <main className="p-6">
        {loading ? (
          <Loader />
        ) : (
          <>
            {/* Summary Cards */}
            <div className="flex flex-col sm:flex-row justify-between gap-6 mb-6">
              {/* Total Orders */}
              <div className="bg-white p-6 rounded-xl shadow flex items-center justify-between gap-4 sm:w-1/2">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <PackageCheck className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Total Orders</p>
                  <h2 className="text-xl font-bold text-gray-800">{orders.length}</h2>
                </div>
              </div>

              {/* Total Revenue */}
              <div className="bg-white p-6 rounded-xl shadow flex items-center gap-4 sm:w-1/2 justify-between">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <IndianRupee className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm font-bold text-gray-500">Total Revenue</p>
                  <h2 className="text-xl font-bold text-green-600">
                    ₹{orders.reduce((sum, order) => sum + order.totalAmount, 0)}
                  </h2>
                </div>
              </div>
            </div>

            {/* Order Table */}
            <div className="bg-white rounded-xl shadow p-4">
              <div className="flex flex-wrap items-end gap-2 mb-4">
                <div className="flex flex-col text-xs">
                  <label htmlFor="fromDate" className="text-gray-600 mb-1">From</label>
                  <input
                    id="fromDate"
                    type="date"
                    className="p-1 border rounded text-xs"
                    value={fromDate}
                    onChange={e => setFromDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <label htmlFor="toDate" className="text-gray-600 mb-1">To</label>
                  <input
                    id="toDate"
                    type="date"
                    className="p-1 border rounded text-xs"
                    value={toDate}
                    onChange={e => setToDate(e.target.value)}
                  />
                </div>
                <div className="flex flex-col text-xs">
                  <label htmlFor="sortOrder" className="text-gray-600 mb-1">Sort</label>
                  <select
                    id="sortOrder"
                    className="p-1 border rounded text-xs"
                    value={sortOrder}
                    onChange={e => setSortOrder(e.target.value)}
                  >
                    <option value="latest">Latest</option>
                    <option value="oldest">Oldest</option>
                  </select>
                </div>
              </div>

              <h3 className="text-base font-semibold mb-2 text-gray-700">Orders</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full text-xs text-left">
                  <thead className="bg-gray-100 text-gray-700 uppercase">
                    <tr>
                      <th className="px-3 py-2">Customer</th>
                      <th className="px-3 py-2">Vendor ID</th>
                      <th className="px-3 py-2">Item</th>
                      <th className="px-3 py-2">Total</th>
                      <th className="px-3 py-2">Status</th>
                      <th className="px-3 py-2">Paid</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map(order => (
                      <tr
                        key={order._id}
                        onClick={() => setSelectedOrder(order)}
                        className="cursor-pointer hover:bg-gray-50 border-b"
                      >
                        <td className="px-3 py-2">{order.username}</td>
                        <td className="px-3 py-2">{order.vendorId}</td>
                        <td className="px-3 py-2">{order.items[0]?.productName}</td>
                        <td className="px-3 py-2">₹{order.totalAmount}</td>
                        <td className="px-3 py-2">{order.orderStatus}</td>
                        <td className="px-3 py-2">{order.isPaid ? 'Yes' : 'No'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Popup for Selected Order */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
        <div className="bg-white w-full max-w-md rounded-lg shadow-lg p-6 relative">
          <button
            onClick={()=> setSelectedOrder(null)}
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

export default AdminDashboard;
