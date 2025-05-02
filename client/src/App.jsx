import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './Components/Layout';
/* Admin Imports */
import AdminDashboard from './AdminFeatures/pages/AdminDashboard';
import Category from './AdminFeatures/pages/Category';
import VendorApprove from './AdminFeatures/pages/VendorApprove';
import Vendors from './AdminFeatures/pages/Vendors';

/* User Imports */
import UserHome from './UserFeatures/pages/UserHome';
import ProductCategoryPage from './UserFeatures/pages/ProductCategoryPage';
import VendorDetailPage from './UserFeatures/pages/VendorDetailPage';
import BillingPage from './UserFeatures/pages/BillingPage';
import UserRegister from './UserFeatures/services/UserRegister';
import UserLogin from './UserFeatures/services/UserLogin';
import OrderTracking from './UserFeatures/pages/OrderTracking';
import UserOrderHistory from './UserFeatures/pages/UserOrderHistory';

/* Vendor Imports */
import VendorRegistration from './VendorFeatures/services/VendorRegistration';
import VendorLogin from './VendorFeatures/services/VendorLogin';
import VendorDashboard from './VendorFeatures/pages/VendorDashboard';
import VendorRoute from './VendorFeatures/ProtectedVendorRoute/VendorRoute';
import ProductManagement from './VendorFeatures/pages/ProductManagement';
import VendorOrderHistory from './VendorFeatures/pages/VendorOrderHistory';

/* Delivery Imports */
import DeliveryDashboard from './DeliveryFeatures/pages/DeliveryDashboard';
import DeliveryRegistration from './DeliveryFeatures/services/DeliveryRegistration';
import DeliveryLogin from './DeliveryFeatures/services/DeliveryLogin';
import DeliveryOrderHistory from './DeliveryFeatures/pages/DeliveryOrderHistory';
import DeliveryRoute from './DeliveryFeatures/ProtectedDeliveryRoute/DeliveryRoute';

const App = () => {
  return (
    <Router>
         <div className="min-h-screen bg-gray-50">
         <Layout>
            <Routes>
              {/* User Routes */}
              <Route path="/" element={<UserHome />} />
              <Route path='/products/category/:title' element={<ProductCategoryPage/>} />
              <Route path='/products' element={<ProductCategoryPage/>} />
              <Route path='/products/dealer/:id' element={<VendorDetailPage/>} />
              <Route path='/billing' element={<BillingPage/>} />
              <Route path='/register/consumer' element={<UserRegister/>} />
              <Route path='/login/consumer' element={<UserLogin/>} />
              <Route path='/order-tracking' element={<OrderTracking/>} />
              <Route path='/orders-history' element={<UserOrderHistory/>} />

              
              {/* Admin Routes */}
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/admin/categories" element={<Category />} />
              <Route path='/admin/vendor-approve' element={<VendorApprove/>}/>
              <Route path='/admin/vendors' element={<Vendors/>}/>

              {/* Vendor Features */}
              <Route path='/register/business' element={<VendorRegistration/>} />
              <Route path='/login/business' element={<VendorLogin/>} />
              <Route path='/business' element={<VendorRoute><VendorDashboard/></VendorRoute>} />
              <Route path='/business/product' element={<ProductManagement/>} />
              <Route path='/business/orders' element={<VendorOrderHistory/>} />



              {/* Delivery Features */}
              <Route path='/register/delivery' element={<DeliveryRegistration/>} />
              <Route path='/login/delivery' element={<DeliveryLogin/>} />
              <Route path='/delivery' element={<DeliveryRoute><DeliveryDashboard/></DeliveryRoute>} />
              <Route path='/delivery/orders' element={<DeliveryOrderHistory/>} />

                  
                    
            </Routes>
      </Layout>
         </div>
    </Router>
  );
};

export default App;
