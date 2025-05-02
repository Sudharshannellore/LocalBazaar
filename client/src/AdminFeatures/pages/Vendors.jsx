import React, { useEffect, useState } from 'react';
import { getVendorsData } from '../../Store/StoredData';
import { X } from 'lucide-react';
import Loader from '../../Components/Loader';

function Vendors() {
  const [vendors, setVendors] = useState([]);
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getVendorsData();
        setVendors(response || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
        setVendors([])
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  return (
    <div className="p-4 md:p-8">
      {loading ? (
        <Loader />
      ) : vendors.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {vendors.map((item) => (
            <div
              key={item.id}
              onClick={() => setSelectedVendor(item)}
              className="border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:shadow-md transition-all"
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
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No vendors found.</p>
      )}

      {/* Vendor Details Modal */}
      {selectedVendor && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
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

            <div className="space-y-2 text-black text-sm sm:text-base">
              <p><strong>Email:</strong> {selectedVendor.businessEmail}</p>
              <p><strong>Phone:</strong> {selectedVendor.phone}</p>
              <p><strong>Address:</strong> {selectedVendor.location?.address}</p>
              <p><strong>City:</strong> {selectedVendor.location?.city}</p>
              <p><strong>State:</strong> {selectedVendor.location?.state}</p>
              <p><strong>Category:</strong> {selectedVendor.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Vendors;
