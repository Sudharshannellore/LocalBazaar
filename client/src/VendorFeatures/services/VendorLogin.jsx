import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function VendorLogin() {
  const [businessEmail, setBusinessEmail] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('http://localhost:8000/vendor/login', {
        businessEmail,
        password,
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
        localStorage.setItem('vendorToken', response.data.token);
        localStorage.setItem('vendorInfo', JSON.stringify(response.data.vendor));
        setTimeout(() => navigate('/business'), 2000);
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
    <div className="bg-white h-screen flex justify-center items-center pt-6">
      <div className="bg-white p-6 rounded-lg shadow-xl w-11/12 sm:w-2/3 md:w-1/2 lg:w-1/3">
        <h3 className="text-2xl font-bold text-black mb-4">Business Login</h3>
        <ToastContainer />
        <form onSubmit={handleLogin}>
          {[
            { id: 'businessEmail', label: 'Email', value: businessEmail, setValue: setBusinessEmail },
            { id: 'password', label: 'Password', value: password, setValue: setPassword, type: 'password' },
          ].map(({ id, label, value, setValue, type = 'text' }) => (
            <div className="mb-4" key={id}>
              <label htmlFor={id} className="text-black block">{label}</label>
              <input
                id={id}
                type={type}
                className="w-full p-2 mt-1 bg-gray-100 text-black border border-gray-300 rounded"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full flex justify-center gap-2 px-4 py-2 bg-gray-950 text-white rounded-lg hover:bg-gray-900"
          >
            Login
          </button>
        </form>
        <Link to="/register/business">
         <p className='text-gray-600 mt-2 text-right hover:text-gray-950 hover:underline' >create account</p>
        </Link>
      </div>
    </div>
  );
}

export default VendorLogin;
