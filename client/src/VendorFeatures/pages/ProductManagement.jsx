import React, { useEffect, useState } from 'react';
import { Plus, Trash, X, Pencil } from 'lucide-react';
import axios from 'axios';
import Loader from '../../Components/Loader';

function ProductManagement() {
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);


  const URL = "http://localhost:8000/vendor";
  const token = localStorage.getItem("vendorToken");
  // Fetch categories
  const fetchProductData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${URL}/get/product`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setProducts(response.data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchProductData();
  }, []);

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [image, setImage] = useState('');
  const [units, setUnits] = useState('');

  const togglePopup = (product = null) => {
    setIsPopupOpen(!isPopupOpen);
    if (product) {
      setSelectedProduct(product);
      setName(product.name);
      setDescription(product.description);
      setPrice(product.price);
      setImage(product.image);
      setUnits(product.units);
    } else {
      setSelectedProduct(null);
      setName('');
      setDescription('');
      setPrice(0);
      setImage('');
      setUnits('');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (selectedProduct) {
        const response = await axios.put(`${URL}/update/product/${selectedProduct._id}`, {
          name,
          description,
          price,
          image,
          units,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setProducts((prev) =>
            prev.map((product) =>
              product._id === selectedProduct._id ? response.data : product
            )
          );
        }
      } else {
        const response = await axios.post(`${URL}/save/product`, {
          name,
          description,
          price,
          image,
          units,
        }, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });

        if (response.status === 200) {
          setProducts((prev) => [...prev, response.data]);
        }
      }

      setName('');
      setDescription('');
      setPrice(0);
      setImage('');
      setUnits('');
      setSelectedProduct(null);
      togglePopup();

    } catch (error) {
      console.error(error);
    }
  };

  const deleteProduct = async (id) => {
    try {
      const response = await axios.delete(`${URL}/delete/product/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
    });
      if (response.status === 200) {
        setProducts((prev) => prev.filter((product) => product._id !== id));
        if (selectedProduct?._id === id) {
          setSelectedProduct(null);
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900"
          onClick={() => togglePopup()}
        >
          <Plus size={20} />
          Add Product
        </button>
      </div>

      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">
                {selectedProduct ? 'Edit Product' : 'Add Product'}
              </h3>
              <X
                className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-600"
                onClick={() => togglePopup()}
              />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="text-black block">Name</label>
                <input
                  id="name"
                  type="text"
                  className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="text-black block">Description</label>
                <textarea
                  id="description"
                  className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="price" className="text-black block">Price</label>
                <input
                  id="price"
                  type="number"
                  className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                  value={price}
                  onChange={(e) => setPrice(Number(e.target.value))}
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="image" className="text-black block">Image Link</label>
                <input
                  id="image"
                  type="text"
                  className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  required
                />
              </div>
              <div className="mb-4">
                <select
                  name="units"
                  onChange={(e) => setUnits(e.target.value)}
                  value={units}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Units</option>
                  <option value="KG">KG</option>
                  <option value="L">L</option>
                  <option value="QTY">QTY</option>            
                </select>
              </div>
              <button
                type="submit"
                className="w-full flex justify-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900"
              >
                {selectedProduct ? 'Update Product' : 'Add Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <Loader />
      ) : products.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((item) => (
            <div
              key={item._id}
              onClick={() => setSelectedProduct(item)}
              className="border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4 cursor-pointer hover:shadow-md transition-all"
            >
              <img
                src={item.image}
                alt={item.name}
                onError={(e) => { e.target.src = '/placeholder.png'; }}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-gray-900 text-center sm:text-left">
                  {item.name}
                </h3>
              </div>
              <div className="flex gap-2">
                <button
                  className="p-2 hover:bg-blue-100 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    togglePopup(item);
                  }}
                  title="Edit"
                >
                  <Pencil size={20} className="text-blue-600" />
                </button>
                <button
                  className="p-2 hover:bg-red-100 rounded-lg"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteProduct(item._id);
                  }}
                  title="Delete"
                >
                  <Trash size={20} className="text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No Products found.</p>
      )}

      {selectedProduct && !isPopupOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-w-md relative">
            <button
              className="absolute top-2 right-2 text-gray-600 hover:text-red-500"
              onClick={() => setSelectedProduct(null)}
            >
              <X className="h-6 w-6" />
            </button>

            <div className="flex flex-col items-center mb-4">
              <img
                src={selectedProduct.image}
                alt={selectedProduct.name}
                className="w-24 h-24 object-cover rounded-lg mb-2"
              />
              <h2 className="text-xl font-semibold text-gray-800">
                {selectedProduct.name}
              </h2>
            </div>

            <div className="space-y-2 text-black text-sm sm:text-base">
              <p><strong>Description:</strong> {selectedProduct.description}</p>
              <p><strong>Price:</strong> ₹{selectedProduct.price}</p>
              <p><strong>Unit:</strong> {selectedProduct.units}</p>
              <p><strong>Created At:</strong> {new Date(selectedProduct.createdAt).toLocaleString()}</p>
              <p
                className={`text-white px-2 py-1 rounded ${
                  selectedProduct.available ? 'bg-green-500' : 'bg-red-500'
                }`}
              >
                {selectedProduct.available ? 'Available' : 'Not Available'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductManagement;
