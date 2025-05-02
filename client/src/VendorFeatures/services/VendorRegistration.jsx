import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { getCategoriesData } from '../../Store/StoredData';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function VendorRegistration() {
  const [businessName, setBusinessName] = useState('');
  const [businessEmail, setBusinessEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [businessLogo, setBusinessLogo] = useState('');
  const [category, setCategory] = useState('');


  const [categories, setCategories] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await getCategoriesData();
        setCategories(response);
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:8000/vendor/register', {
        businessName,
        businessEmail,
        password,
        phone,
        address,
        city,
        state,
        businessLogo,
        category
      });

      if (response.status === 200) {
        toast.success(response.data.message, {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored",
                  transition: Bounce,
                });
        setTimeout(() => navigate('/login/business'), 2000);
      }
    } catch (error) {
      console.log(error);
      if (error.response) {
        toast.error(error.response.data.message || 'Something went wrong!',
                {
                  position: "top-right",
                  autoClose: 2000,
                  hideProgressBar: false,
                  closeOnClick: false,
                  pauseOnHover: true,
                  draggable: true,
                  theme: "colored",
                  transition: Bounce,
                });
      } else {
        toast.error('Please try again..!',
          {
            position: "top-right",
            autoClose: 2000,
            hideProgressBar: false,
            closeOnClick: false,
            pauseOnHover: true,
            draggable: true,
            theme: "colored",
            transition: Bounce,
          });
      }
    }
  };

  return (
    <div className="min-h-screen flex justify-center items-start bg-white py-10">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3 max-h-[90vh] overflow-y-auto">
        <h3 className="text-xl sm:text-2xl font-bold text-black mb-3">Business Account</h3>

        <ToastContainer />

        <form onSubmit={handleRegister}>
          {[
            { id: 'businessName', label: 'Name', value: businessName, setValue: setBusinessName },
            { id: 'businessEmail', label: 'Email', value: businessEmail, setValue: setBusinessEmail },
            { id: 'password', label: 'Password', value: password, setValue: setPassword, type: 'password' },
            { id: 'phone', label: 'Phone', value: phone, setValue: setPhone,  type: 'number' },
            { id: 'address', label: 'Address', value: address, setValue: setAddress },
            { id: 'city', label: 'City', value: city, setValue: setCity },
            { id: 'state', label: 'State', value: state, setValue: setState },
            { id: 'businessLogo', label: 'Logo URL', value: businessLogo, setValue: setBusinessLogo }
          ].map(({ id, label, value, setValue, type = 'text' }) => (
            <div className="mb-3" key={id}>
              <label htmlFor={id} className="text-black text-sm block">{label}</label>
              <input
                id={id}
                type={type}
                className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded text-sm"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          ))}

          <div className="mb-3">
            <label htmlFor="category" className="text-black text-sm block">Category</label>
            <select
              id="category"
              onChange={(e) => setCategory(e.target.value)}
              value={category}
              className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded text-sm"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat.title || 'Unknown'}>
                  {cat.title || 'Unknown'}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full flex justify-center gap-2 px-4 py-2 mt-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900 text-sm"
          >
            Register Business
          </button>
        </form>

        <Link to="/login/business">
          <p className='text-gray-600 mt-2 text-right text-sm hover:text-gray-950 hover:underline'>
            Already have an account?
          </p>
        </Link>
      </div>
    </div>
  );
}

export default VendorRegistration;
