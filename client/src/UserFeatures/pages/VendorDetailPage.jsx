import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getVendorsData } from '../../Store/StoredData';
import Loader from '../../Components/Loader';
import axios from 'axios';
import { Plus, ChevronDown, ChevronUp } from 'lucide-react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function StarRating({ rating }) {
  const fullStars = Math.floor(rating);
  const hasHalf = rating % 1 !== 0;
  return (
    <div className="flex items-center gap-0.5">
      {[...Array(fullStars)].map((_, i) => (
        <span key={i} className="text-yellow-400 text-xl">&#9733;</span>
      ))}
      {hasHalf && <span className="text-yellow-400 text-xl">&#189;</span>}
      {[...Array(5 - fullStars - (hasHalf ? 1 : 0))].map((_, i) => (
        <span key={i} className="text-gray-300 text-xl">&#9733;</span>
      ))}
    </div>
  );
}

function VendorDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [averageRating, setAverageRating] = useState(0);
  const [reviewSectionVisible, setReviewSectionVisible] = useState(false);
  const [userRating, setUserRating] = useState(0);
  const [comment, setComment] = useState('');
  const [cartItems, setCartItems] = useState([]);

  {/* Vendors Information */}
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

  const vendor = vendors.find(v => String(v.id) === id);

  {/* Products Data from related vendor */}
  useEffect(() => {
    const getProducts = async () => {
      try {
        const response = await axios.post(`http://localhost:8000/user/vendor/product/${id}`);
        setProducts(response.data || []);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };
    getProducts();
  }, [id]);

  {/* Review & Ratings for vendors */}
  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/vendor/get/review/${id}`);
        setReviews(res.data);
        const avgRating = res.data.reduce((acc, review) => acc + review.rating, 0) / res.data.length;
        setAverageRating(avgRating || 0);
      } catch (err) {
        console.error('Error fetching reviews:', err);
      }
    };
    fetchReviews();
  }, [id]);

  {/* Usernames for reviews */}
  const [usernames, setUsernames] = useState({}); // { userId: username }

  useEffect(() => {
    const fetchUsernames = async () => {
      const uniqueIds = [...new Set(reviews.map((r) => r.user))];
      const fetched = {};

      await Promise.all(
        uniqueIds.map(async (id) => {
          try {
            const res = await axios.get(`http://localhost:8000/user/get/username/${id}`);
            fetched[id] = res.data.username; // Adjust according to your API
          } catch (err) {
            console.error(`Error fetching username for ${id}:`, err);
            fetched[id] = 'Anonymous'; // fallback
          }
        })
      );

      setUsernames(fetched);
    };

    if (reviews.length > 0) {
      fetchUsernames();
    }
  }, [reviews]);

  {/* Reviews & Rating Submission */}
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`http://localhost:8000/vendor/create/review/${id}`, {
        rating: userRating,
        comment
      }, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('userToken')}`
        }
      });

      setUserRating(0);
      setComment('');
      setReviewSectionVisible(true);
    } catch (err) {
      console.error('Review submission failed:', err);
    }
  };

  {/* Products adding into cart */}
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find(item => item._id === product._id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item._id === product._id ? { ...item, quantity: item.quantity + 1 } : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (productId, delta) => {
    setCartItems(prevItems =>
      prevItems
        .map(item => item._id === productId ? { ...item, quantity: item.quantity + delta } : item)
        .filter(item => item.quantity > 0)
    );
  };

  const isInCart = (productId) => {
    return cartItems.some(item => item._id === productId);
  };

  const getCartItem = (productId) => {
    return cartItems.find(item => item._id === productId);
  };

  const goToBillingPage = () => {
    navigate('/billing', { state: { cartItems } });
  };

  return (
    <div>
      <Navbar />
      <br />
      <div className="p-4 md:p-8">
        {loading ? (
          <Loader />
        ) : vendor ? (
          <div className="max-w-6xl mx-auto px-4">
            {/* Vendor Info */}
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <div className="flex justify-between items-start">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">{vendor.businessName}</h1>
                  <p className="text-gray-600 mb-2">
                    {`${vendor.location?.address}, ${vendor.location?.city}, ${vendor.location.state}`}
                  </p>
                  <div className="flex items-center gap-2">
                    <StarRating rating={averageRating} />
                    <span className="text-sm text-gray-600">({averageRating.toFixed(1)} avg)</span>
                  </div>
                </div>
                {vendor.businessLogo && (
                  <img
                    src={vendor.businessLogo}
                    alt={vendor.businessName}
                    className="w-24 h-24 object-cover rounded-lg mb-2"
                  />
                )}
              </div>

              {/* Toggle Arrow */}
              <div className="flex justify-center mt-4">
                <button
                  onClick={() => setReviewSectionVisible(!reviewSectionVisible)}
                  className="text-gray-600 hover:text-black"
                >
                  {reviewSectionVisible ? <ChevronUp size={24} /> : <ChevronDown size={24} />}
                </button>
              </div>

              {/* Review Section */}
              {reviewSectionVisible && (
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-xl font-semibold mb-2">Customer Reviews</h3>
                  {reviews.length === 0 ? (
                    <p className="text-gray-500">No reviews yet.</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="mb-4 border-b pb-2">
                        <div className="flex justify-between items-center">
                          <h4 className="font-medium">{usernames[r.user] || 'Anonymous'}</h4>
                          <StarRating rating={r.rating} />
                        </div>
                        <p className="text-sm text-gray-700">{r.comment}</p>
                      </div>
                    ))
                  )}

                  {/* Review Input */}
                  <form onSubmit={handleReviewSubmit} className="mt-4">
                    <div className="flex gap-1 mb-2">
                      {[1, 2, 3, 4, 5].map(star => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setUserRating(star)}
                          className={`text-2xl ${star <= userRating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                          &#9733;
                        </button>
                      ))}
                    </div>
                    <textarea
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      className="w-full border rounded p-2 mb-2"
                      placeholder="Write your review..."
                      required
                    />
                    <button
                      type="submit"
                      className="bg-gray-950 text-white px-4 py-2 rounded hover:bg-gray-900"
                    >
                      Submit Review
                    </button>
                  </form>
                </div>
              )}
            </div>

            {/* Products Section */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Our Products</h2>
              {products.length > 0 ? (
                products.map(product => {
                  const item = getCartItem(product._id);
                  return (
                    <div key={product._id} className="mb-8">
                      <div className="flex justify-between items-center border-b pb-6">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900 mb-1">{product.name}</h4>
                          <p className="text-gray-600 mb-2">₹{product.price}/{product.units}</p>
                          <p className="text-gray-500 text-sm">{product.description}</p>
                        </div>
                        <div className="flex items-center gap-4">
                          {product.image && (
                            <img
                              src={product.image}
                              alt={product.name}
                              className="w-24 h-24 object-cover rounded-lg"
                            />
                          )}
                          {isInCart(product._id) ? (
                            <div className="flex items-center gap-2">
                              <button onClick={() => handleQuantityChange(product._id, -1)} className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100">-</button>
                              <span>{item.quantity}</span>
                              <button onClick={() => handleQuantityChange(product._id, 1)} className="px-3 py-1 text-gray-600 border rounded hover:bg-gray-100">+</button>
                            </div>
                          ) : (
                            <button
                              onClick={() => handleAddToCart(product)}
                              className="px-4 py-2 bg-white border border-gray-950 text-gray-950 rounded-lg hover:bg-gray-800 hover:text-white flex items-center gap-2"
                            >
                              <Plus size={16} />
                              Add
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500">No products available for this vendor.</p>
              )}
            </div>

            {/* Cart Section */}
            {cartItems.length > 0 && (
              <div className="fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border border-gray-950 shadow-lg rounded-t-lg p-4 w-[350px] z-50">
                <h3 className="text-lg font-semibold mb-2">Your Cart</h3>
                <ul className="mb-4 max-h-40 overflow-y-auto">
                  {cartItems.map((item) => (
                    <li key={item._id} className="flex justify-between items-center border-b py-1">
                      <div>
                        <p className="font-medium">{item.name}</p>
                        <p className="text-sm text-gray-500">₹{item.price} x {item.quantity}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleQuantityChange(item._id, -1)}
                          className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          onClick={() => handleQuantityChange(item._id, 1)}
                          className="px-2 py-1 text-gray-600 border rounded hover:bg-gray-100"
                        >
                          +
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
                <button
                  onClick={goToBillingPage}
                  className="w-full py-2 bg-gray-950 text-white rounded hover:bg-gray-800"
                >
                  Proceed
                </button>
              </div>
            )}
          </div>
        ) : (
          <p>Dealer not found.</p>
        )}
      </div>
      <br/>
      <Footer/>
    </div>
  );
}

export default VendorDetailPage;
