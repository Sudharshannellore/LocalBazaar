import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Check, X } from 'lucide-react';
import Loader from '../../Components/Loader';

function VendorApprove() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  
  const URL = 'http://localhost:8000/admin';

  const fetchPending = async () => {
    try {
      const response = await axios.get(`${URL}/pending/vendor`);
      setVendors(response.data);
    } catch (err) {
      console.error(err);
    }
    finally{
      setLoading(false);
    }
  };

  const approve = async (id) => {
    await axios.post(`${URL}/approve/vendor/${id}`);
    setSelectedVendor(null);
    fetchPending();
  };

  const reject = async (id) => {
    await axios.post(`${URL}/reject/vendor/${id}`);
    setSelectedVendor(null);
    fetchPending();
  };

  useEffect(() => {
    fetchPending();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {/* Vendor Cards Grid */}
      {loading ? (<Loader/>) : 
          vendors.length > 0 ? (     <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {vendors.map((item) => (
              <div
                key={item._id}
                onClick={() => setSelectedVendor(item)}
                className="border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer"
              >
                <img
                  src={item.businessLogo}
                  alt={item.businessName}
                  className="w-24 h-24 object-cover rounded-lg"
                />
                <div className="flex-1 w-full">
                  <h3 className="font-semibold text-gray-900 text-center sm:text-left">
                    {item.businessName}
                  </h3>
                </div>
                <button
                  className="p-2 hover:bg-green-100 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    approve(item._id);
                  }}
                  title="Approve"
                >
                  <Check size={20} className="text-green-600" />
                </button>
                <button
                  className="p-2 hover:bg-red-100 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    reject(item._id);
                  }}
                  title="Reject"
                >
                  <X size={20} className="text-red-600" />
                </button>
              </div>
            ))}
          </div>) : (<p className="text-center text-gray-500">No pending vendor approvals.</p>)}
      {/* Vendor Details Popup */}
      {selectedVendor && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setSelectedVendor(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedVendor.businessLogo}
                alt={selectedVendor.businessName}
                className="w-24 h-24 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedVendor.businessName}
              </h2>
            </div>

            <div className="space-y-2 text-black">
              <p><strong>Email:</strong> {selectedVendor.businessEmail}</p>
              <p><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p><strong>Address:</strong> {selectedVendor.location?.address}</p>
              <p><strong>City:</strong> {selectedVendor.location?.city}</p>
              <p><strong>State:</strong> {selectedVendor.location?.state}</p>
              <p><strong>Status:</strong> {selectedVendor.approvedStatus}</p>
            </div>

            <div className="flex justify-end gap-4 mt-6">
              <button
                className="text-green-600 hover:text-green-800"
                onClick={() => approve(selectedVendor._id)}
              >
                <Check className="h-6 w-6" />
              </button>
              <button
                className="text-red-600 hover:text-red-800"
                onClick={() => reject(selectedVendor._id)}
              >
                <X className="h-6 w-6" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default VendorApprove;
