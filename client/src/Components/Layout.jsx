import React from 'react';
import { useLocation } from 'react-router-dom';
import AdminSideBar from '../AdminFeatures/components/AdminSideBar'
import VendorSideBar from '../VendorFeatures/components/VendorSideBar';
import DeliverySideBar from '../DeliveryFeatures/components/DeliverySidebar';


const Layout = ({ children }) => {
  const location = useLocation();

  const getSidebar = () => {
    if (location.pathname.startsWith('/admin')) {
      return <AdminSideBar/>;
    }
    if (location.pathname.startsWith('/business')) {
      return <VendorSideBar/>;
    }
    if (location.pathname.startsWith('/delivery')) {
      return <DeliverySideBar/>;
    }
    return null; // User view has no sidebar
  };

  return (
    <div className="flex min-h-screen">
      {getSidebar() && <div className="w-64 bg-gray-100">{getSidebar()}</div>}
      <div className="flex-1 p-4">
        {children}
      </div>
    </div>
  );
};

export default Layout;
