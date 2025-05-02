import React, { useEffect, useRef, useState } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Leaf, Smile, Truck } from 'lucide-react';
import { Link } from 'react-router-dom';
import { getCategoriesData } from '../../Store/StoredData';
import Loader from '../../Components/Loader';
import Navbar from '../components/Navbar'
import Footer from '../components/Footer';

function UserHome() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getData = async () => {
      try {
        const response = await getCategoriesData();
        setCategories(response);
      } finally {
        setLoading(false);
      }
    };
    getData();
  }, []);

  const scrollRef = useRef(null);
  const scroll = (direction) => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({
        left: direction === "left" ? -400 : 400,
        behavior: "smooth",
      });
    }
  };

  return (
  <div>
       <Navbar/> 
     <div className="max-w-7xl mx-auto px-4">
      {/* Hero Section */}
      <div className="relative h-[500px] flex items-center">
        <div
          className="absolute inset-0 z-0"
          style={{
            backgroundImage:
              'url(https://images.unsplash.com/photo-1488459716781-31db52582fe9?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        >
          <div className="absolute inset-0 bg-black bg-opacity-50"></div>
        </div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-14 relative z-10">
          <div className="max-w-2xl text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Support Local, Shop Global
            </h1>
            <p className="text-base sm:text-lg md:text-xl mb-6 sm:mb-8">
              Connect with local farmers, artisans, and small businesses.
              Get fresh produce and authentic handcrafted products delivered to your doorstep.
            </p>
            <Link to='/products'>
              <button className="inline-flex items-center gap-2 px-6 py-3 backdrop-blur-sm
                               text-white font-semibold rounded-full 
                               hover:bg-white hover:text-gray-950 transition"
              >
                Order Now
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
          
      </div>

      {/* Dynamic Categories */}
      {loading ? (
        <Loader />
      ) : categories.length > 0 ? (
        <div className="relative px-4 mt-10">
          <h2 className="text-2xl font-bold text-left mb-8">What's on your mind?</h2>

          {/* Scroll Buttons */}
          <button
            onClick={() => scroll("left")}
            className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <ChevronLeft size={28} />
          </button>

          {/* Scrollable Categories */}
          <div
            ref={scrollRef}
            className="flex overflow-x-auto gap-10 px-12 scroll-smooth justify-center md:justify-start"
            style={{
              scrollbarWidth: 'none', // Firefox
              msOverflowStyle: 'none', // IE and Edge
            }}
          >
            <style>
              {`
                /* Hide scrollbar for WebKit browsers */
                div::-webkit-scrollbar {
                  display: none;
                }
              `}
            </style>
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/products/category/${category.title}`}
                className="flex flex-col items-center space-y-4 min-w-[132px]"
              >
                <div className="w-32 h-32 rounded-full overflow-hidden shadow-md">
                  <img
                    src={category.image}
                    alt={category.title}
                    className="w-full h-full object-cover"
                  />
                </div>
                <p className="text-lg text-center font-semibold">{category.title}</p>
              </Link>
            ))}
          </div>

          <button
            onClick={() => scroll("right")}
            className="hidden md:flex absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2"
          >
            <ChevronRight size={28} />
          </button>
        </div>
      ) : ( 
        <p className="text-center text-gray-500 mt-5">No categories found.</p>
      )}

      <br />

          {/* Features */}
          <div className="container mx-auto px-4 py-12">
            <h2 className="text-2xl font-bold text-left mb-8">
              Why Choose Local Bazaar?
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              
              {/* Card */}
              {[
                {
                  icon: <Leaf className="h-8 w-8 text-white" />,
                  title: "Fresh & Organic",
                  desc: "Direct from local farmers and producers, ensuring the highest quality and freshness.",
                },
                {
                  icon: <Truck className="h-8 w-8 text-white" />,
                  title: "Fast Delivery",
                  desc: "Same-day delivery available for fresh produce and local products.",
                },
                {
                  icon: <Smile className="h-8 w-8 text-white" />,
                  title: "Support Local Communities",
                  desc: "Every purchase helps local farmers, tribal artisans, and small businesses sustain their livelihoods.",
                },
              ].map((feature, index) => (
                <div
                  key={index}
                  className="group mt-4 relative text-center p-6 bg-white/60 backdrop-blur-md rounded-2xl shadow-xl transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:bg-white"
                >
                  <div className="absolute -top-6 left-1/2 -translate-x-1/2">
                    <div className="p-4 bg-gray-950 rounded-full shadow-md transition-all duration-300 group-hover:scale-110 group-hover:rotate-3">
                      {feature.icon}
                    </div>
                  </div>
                  <div className="mt-10">
                    <h3 className="text-xl font-bold text-gray-950 mb-3">{feature.title}</h3>
                    <p className="text-sm text-gray-600 px-2">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
     
     <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to join our community?</h2>
          <p className="text-gray-600 max-w-2xl mx-auto mb-8">
          Start shopping for fresh, local products or become a vendor and reach more customers.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link to='/register/business'>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-gray-950 
                         text-white rounded-full hover:bg-gray-900 transition"
              >
                Become a Dealer
                <ArrowRight size={20} />
              </button>
            </Link>
            <Link to='/products'>
              <button className="inline-flex items-center gap-2 px-6 py-3 bg-white 
                               text-gray-950 font-semibold rounded-full 
                               hover:bg-gray-950 hover:text-white transition"
              >
                Order Now
                <ArrowRight size={20} />
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
    <br />
    <Footer/>
       </div>
  );
}

export default UserHome;
