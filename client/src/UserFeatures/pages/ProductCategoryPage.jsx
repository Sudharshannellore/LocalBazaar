import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getVendorsData } from '../../Store/StoredData';
import Loader from '../../Components/Loader';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ProductCategoryPage() {
  const navigate = useNavigate();
  const { title } = useParams();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCity, setSelectedCity] = useState('City');

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getVendorsData();
        setVendors(response || []);
      } catch (error) {
        console.error('Error fetching vendors:', error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  // Extract unique cities from vendor data
  const cityList = ['City', ...new Set(vendors.map(v => v.location?.city).filter(Boolean))];

  // Filter by category (title) and selected city
  const filteredVendors = vendors.filter(vendor => {
    const categoryMatch = title ? vendor.category?.toLowerCase() === title.toLowerCase() : true;
    const cityMatch = selectedCity === 'City' || vendor.location?.city === selectedCity;
    return categoryMatch && cityMatch;
  });

  return (
      <div>
         <Navbar/> 
          <br/>
      
      <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-semibold">
          {title ? `${title} Dealers` : 'All Dealers'}
        </h2>

        {/* City Filter Dropdown */}
      </div>
      <div>
      <select
          value={selectedCity}
          onChange={(e) => setSelectedCity(e.target.value)}
          className="border border-gray-300 rounded-md px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          {cityList.map((city, index) => (
            <option key={index} value={city}>
              {city}
            </option>
          ))}
        </select>
      </div>
      <br />

      {/* Content */}
      {loading ? (
        <Loader />
      ) : filteredVendors.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filteredVendors.map((vendor) => (
            <div
              key={vendor._id}
              onClick={() => navigate(`/products/dealer/${vendor.id}`)}
              className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer transform transition-transform hover:scale-105"
            >
              <img
                src={vendor.businessLogo}
                alt={vendor.businessName}
                className="w-full h-36 object-cover"
              />
              <div className="p-3">
                <h3 className="text-lg font-medium text-gray-800 truncate">
                  {vendor.businessName}
                </h3>
                <p className="text-sm text-gray-600">{vendor.location?.city}</p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No Dealers found.</p>
      )}
    </div>
    <br/>
    <Footer/>
      </div>
  );
}

export default ProductCategoryPage;
