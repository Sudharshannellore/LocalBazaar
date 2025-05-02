import React, { useEffect, useState } from 'react';
import { Plus, Trash, X } from 'lucide-react';
import axios from 'axios';
import { getCategoriesData } from '../../Store/StoredData';
import Loader from '../../Components/Loader';

function Category() {
  const URL = "https://localbazaar.onrender.com/admin";

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');

  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const togglePopup = () => setIsPopupOpen(!isPopupOpen);

  // Fetch categories
  const fetchCategories = async () => {
    setLoading(true);
    try {
      const response = await getCategoriesData();
      setCategories(response);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Add new category
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${URL}/save/category`, { title, image });
      if (response.status === 200) {
        setCategories((prev) => [...prev, response.data]);
        setTitle('');
        setImage('');
        togglePopup();
      }
    } catch (error) {
      console.error("Failed to add category:", error);
    }
  };

  // Delete category
  const deleteCategory = async (id) => {
    try {
      const response = await axios.delete(`${URL}/delete/category/${id}`);
      if (response.status === 200) {
        setCategories((prev) => prev.filter((category) => category._id !== id));
      }
    } catch (error) {
      console.error("Failed to delete category:", error);
    }
  };

  return (
    <div className="p-4 md:p-8">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900"
          onClick={togglePopup}
        >
          <Plus size={20} />
          Add Category
        </button>
      </div>

      {/* Popup Form */}
      {isPopupOpen && (
        <div className="fixed inset-0 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-2xl font-bold text-black">Add Category</h3>
              <X className="h-6 w-6 cursor-pointer text-red-500 hover:text-red-600" onClick={togglePopup} />
            </div>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="text-black block">Title</label>
                <input
                  id="title"
                  type="text"
                  className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
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
              <button
                type="submit"
                className="w-full flex justify-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900"
              >
                Add Category
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Categories Display */}
      {loading ? (
        <Loader />
      ) : categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {categories.map((item) => (
            <div key={item._id} className="border rounded-lg p-4 flex flex-col sm:flex-row items-center gap-4">
              <img
                src={item.image}
                alt={item.title}
                className="w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1 w-full">
                <h3 className="font-semibold text-gray-900 text-center sm:text-left">{item.title}</h3>
              </div>
              <button
                className="p-2 hover:bg-red-100 rounded-lg"
                onClick={() => deleteCategory(item._id)}
                title="Delete"
              >
                <Trash size={20} className="text-red-600" />
              </button>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No categories found.</p>
      )}
    </div>
  );
}

export default Category;
